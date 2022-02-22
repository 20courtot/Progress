module.exports = mongoose => {
    const Project = mongoose.model("project",
        mongoose.Schema({
            name: String,
            stages:Array
        })
    );
    return Project;
};