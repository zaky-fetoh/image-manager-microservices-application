const http = require("http");
const amqp = require("amqplib");

const imageModel = require("../model/image");
const SD = require("./service-discovery");



const getIS_addr = async () => {
    const IS_addr = await SD.discover("image-storage", "1.0.0")
    if (IS_addr) return {
        IS_HOST: IS_addr.hostname,
        IS_PORT: IS_addr.port
    };else throw new Error('No Image Storage Found');
}


// "/image/:encrypt"
exports.addImage = async (req, res, next) => {

    const { IS_HOST, IS_PORT } = getIS_addr()

    const encrypt = req.params.encrypt === "true";
    const path = (encrypt ? "/cipher" : "/plain") + "-image";
    const user_id = req.user_id;

    const data = [];

    const imreq = http.request({
        host: IS_HOST, port: IS_PORT, path: path,
        method: "POST", headers: req.headers,
    }, imres => {
        imres.on("data", chunk => data.push(chunk));
        imres.on("error", console.error);
        imres.on("end", async () => {
            const jdata = JSON.parse(Buffer.concat(data).toString());
            console.log(jdata);
            if (jdata.ok) {
                const im = await imageModel.create({
                    image_id: jdata.imageName,
                    owner: user_id,
                    stored_incrypted: encrypt,
                });
                exports.predictTages(im._id.toString())
                return res.status(200).json({
                    image_id: im._id,
                    ok: true,
                })
            } else {
                return res.status(500).json({
                    ok: false,
                })
            }
        })
    })
    req.pipe(imreq);
};

// /image/:imageId
exports.deleteImage = async (req, res, next) => {

    const { IS_HOST, IS_PORT } = getIS_addr()

    const user_id = req.user_id;
    const image_id = req.params.imageId;
    const imDoc = await imageModel.findOne({
        _id: image_id, owner: user_id,
    });

    if (!imDoc) return res.status(404).json({
        ok: false, message: "File not found",
    })

    const encrypt = imDoc.stored_incrypted === "true";
    const path = (encrypt ? "/cipher" : "/plain") +
        "-image/" + imDoc.image_id;
    const data = []
    const imreq = http.request({
        host: IS_HOST, port: IS_PORT, path: path,
        method: "DELETE", headers: req.headers,
    }, dres => {
        dres.on("data", chunk => data.push(chunk))
        dres.on("error", err => res.status(500).json({
            ok: false, message: err.message,
        }));
        dres.on("end", async () => {
            const jdata = JSON.parse(Buffer.concat(data).toString());
            if (jdata.ok) {
                const result = await imageModel.deleteOne({
                    _id: image_id, owner: user_id,
                });
                res.status(200).json({
                    ok: true, deletedCount: result.deletedCount,
                })
            } else {
                res.status(500).json({
                    ok: false, message: jdata.message,
                });
            }
        });
    }).end();
};


// /view-image/:imageId GET
exports.viewImage = async (req, res, next) => {
    const { IS_HOST, IS_PORT } = getIS_addr()
    const user_id = req.user_id;
    const imageId = req.params.imageId;

    const imDoc = await imageModel.findOne({
        _id: imageId,
    }, { __v: 0 });

    if (!imDoc) return res.status(404).json({
        ok: false, message: "image not found",
    })
    if (user_id !== imDoc.owner.toString()) {
        imDoc.view_count++;
        setImmediate(async () => await imDoc.save());
    }
    const encrypt = imDoc.stored_incrypted === "true";
    const path = (encrypt ? "/cipher" : "/plain") +
        "-image/" + imDoc.image_id;

    http.get({
        host: IS_HOST, port: IS_PORT,
        path: path, headers: req.headers,
    }, ires => {
        ires.pipe(res)
    }).end()
};


exports.predictTages = async (imageId) => {
    const imDoc = await imageModel.findOne({
        _id: imageId,
    })
    const conn = await amqp.connect(process.env.RABBITMQ);
    const channel = await conn.createChannel();
    const exch = await channel.assertExchange(process.env.MQ_EXCHANGE,
        "direct", { durable: false });
    const resq = await channel.assertQueue("", {
        durable: true,
    });
    channel.publish(exch.exchange, "resnet",
        Buffer.from(imDoc.image_id + " XX " + imDoc.stored_incrypted), {
        correlationId: imageId,
        replyTo: resq.queue,
    });
    await channel.consume(resq.queue, async (msg) => {
        body = JSON.parse(msg.content.toString());
        imDoc.tags = body.labels;
        await imDoc.save()
    })

}