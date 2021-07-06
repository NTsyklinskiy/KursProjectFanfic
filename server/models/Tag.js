const { Schema, model } = require("mongoose");
const tagSchema = new Schema({
  tags: [{
    type:String
  }]
});



tagSchema.pre(/^findOneAnd/, async function(next){
  this.r = await this.findOne();
  next()
});

tagSchema.post(/^findOneAnd/, async function(){
  this.r.tags = [...new Set(this.r.tags)]
  this.r.save()  
});
exports.Tag = model("Tag", tagSchema);