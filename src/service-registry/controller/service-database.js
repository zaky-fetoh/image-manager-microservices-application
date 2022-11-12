const serviceModel = require("../model/service-model");
const semver = require("semver");

exports.addService = async (service_info) => {
    /********************************************
     * This method insert a service to the Database
     * input: service info {name, version, hostname, port}
     * return {ok: Boolean, service_id: ObjectId}
     ********************************************/
    try {
        const doc = await serviceModel.create(service_info);
        return { ok: true, service_id: doc._id };
    } catch (e) {
        return { ok: false, message: e.message };
    }
};

const RandInt = (n)=>{ // Generate Random NUMBer
    return Math.floor(Math.random() * n);
}

exports.getService=async(service_filter_info)=>{
        /********************************************
     * This method retrive a service from Database
     * input: service info {name, version, hostname, port}
     * return {ok: Boolean, hostname: String, Port:Number}
     ********************************************/
    const searchVersion = service_filter_info.version;
    delete service_filter_info.version;
    const services = await serviceModel.find(service_filter_info,
        {__v:0});
    const filteredVersion = services.filter(service=> semver.satisfies(
        service.version, searchVersion
    ));
    if(filteredVersion.length > 0)
    return filteredVersion[RandInt(filteredVersion.length)];
    else return null;
}

exports.deleteService = async (service_info) => {
    /********************************************
     * This method delte a service from Database
     * input: service info {name, version, hostname, port}
     * return {ok: Boolean, deletedCount: ObjectId}
     ********************************************/
    try {
        const dltDocs = await serviceModel.deleteMany(service_info);
        return { ok: true, deletedCount: dltDocs.deletedCount };
    } catch (e) {
        return { ok: false, message: e.message };
    }
};

