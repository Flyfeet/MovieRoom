var MovieItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.name = obj.name;
        this.country = obj.country;
		this.category = obj.category;
		this.score = obj.score;
		this.links = obj.links;
		this.author = obj.author;
	} else {
	    this.name = "";
	}
};

MovieItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var MovieRoom = function () {
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new MovieItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

MovieRoom.prototype = {
    init: function () {
        
    },

    save: function (name, country,category,score,links) {

        name = name.trim();
        country = country.trim(); 
		category = category.trim();
		score = score.trim();
        links = links.trim();
        if (!name || !country|| !category|| !score || !links){
            throw new Error("empty name or country or category or score or links.");
        }
        if (name.length >128 || country.length >128 || category.length >128 || score.length >32 ||links.length > 256){
            throw new Error("name or country or category or score or links exceed limit length.")
        }

        var from = Blockchain.transaction.from;
        var movieItem = this.data.get(name);
        if (movieItem){
            throw new Error("The movie was existed.");
        }

        movieItem = new MovieItem();
        movieItem.author = from;
        movieItem.name = name;
        movieItem.country = country;
		movieItem.category = category;
		movieItem.score = score;
        movieItem.links = links;

        this.data.put(name, movieItem);
    },

    get: function (name) {
        name = name.trim();
        if ( !name ) {
            throw new Error("Empty name.")
        }
        return this.data.get(name);
    }
};
module.exports = MovieRoom;
