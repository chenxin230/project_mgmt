class Book {
    constructor(name, shelf_no, category, author) {
    this.name = name;
    this.shelf_no = shelf_no;
    this.category = category;
    this.author = author;
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
    }
    module.exports = { Book };