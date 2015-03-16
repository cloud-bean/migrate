exports.iterateEle = function(elements,index,handler,callback){
    for(;index<elements.length;index++)
    {
	var ele = elements[index];
	handler(ele,function(err){
	    if (err) {
		console.log(err);
	    }
	});
    }
    return callback();
};
