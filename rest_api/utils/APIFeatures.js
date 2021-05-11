class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: 'i'
      }
    } : {};

    console.log("KEYWORD", keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = {...this.queryStr};
    
    console.log('Query Copy', queryCopy);

    //Remove fields from the query
    const removeFields = ['keyword', 'limit', 'page'];

    removeFields.forEach(el => delete queryCopy[el]);
    
    //Advance filter for price, ratings, etc
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)


    console.log('Now Query Copy', queryCopy);

    
    this.query = this.query.find(JSON.parse(queryCopy));
    return this;
  }

  pagination(perPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = perPage * (currentPage - 1);

    this.query = this.query.limit(perPage).skip(skip);
    return this;

  }
}

module.exports = APIFeatures;