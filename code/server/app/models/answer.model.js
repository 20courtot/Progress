module.exports = mongoose => {
    const Answer = mongoose.model("answer",
        mongoose.Schema({
            id_user: String,
            id_project:String,
            progress:Array,
        })
    );
    return Answer;
};