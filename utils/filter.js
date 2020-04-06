class APIFilters {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    //Advance filter using :lt,lte,gt,gte
    //{{DOMAIN}}/api/v1/jobs?salary[gte]=12222222222
    //{{DOMAIN}}/api/v1/jobs?location.city=noida
    //localhost:3000/api/v1/getProduct?category=Man&subCategory=Clothing

    // Removing fields from the query
    const removeFields = ["sort", "fields", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //{{DOMAIN}}/api/v1/jobs?sort=-salary
    //{{DOMAIN}}/api/v1/jobs?sort=salary,positions
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" "); //salary jobType
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limit() {
    // localhost:3000/api/v1/getProduct?fields=name,price,brand
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    //{{DOMAIN}}/api/v1/jobs?page=10&limit=2
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 5;
    const skipResults = (page - 1) * limit;

    this.query = this.query.skip(skipResults).limit(limit);
    return this;
  }
}

module.exports = APIFilters;
