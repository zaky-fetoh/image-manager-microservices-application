const axios = require("axios");

const SR_HOST = process.env.SER_REG_HOST;
const SR_PORT = process.env.SER_REG_PORT;

discURL = `http://${SR_HOST}:${SR_PORT}/service`

exports.getServiceURL = async (name, version) => {
    try {
        const res = await axios.get(
            `${discURL}/${name}/${version}`);
        return {
            ok: true, port: res.data.port,
            hostname: res.data.hostname,
            fullname: `http://${res.data.hostname}:${res.data.port}`
        }
    } catch (e) {
        return {
            ok: false, message: e.message,
        }
    };
}

