const Person = require('../person');
const User = require('../users/user');
const Admin = require('../admin/admin');
const Teacher = require('../users/teacher/teacher');
const Senior = require('../users/students/senior/senior');
const Junior = require('../users/students/junior/junior');
const library = require('../../data/library/library');
const givenBook = require('../../data/borrower_catalog/givenBooks');

//an instance of Admin
var Kingsley = new Admin('Kingsley');

//an instance of Teacher
const David = new Teacher('David', 2345);

//an instance of Teacher
const Austin = new Teacher('Austin', 1123);

//an instance of a Senior Student
const Ekene = new Senior('Ekene', 5434);

//an instance of a Senior Student
const Eniola = new Senior('Eniola', 6445);

//an instance of Junior Student
const Dare = new Junior('Dare', 6543);

//an instance of Junior Student
const Nnamdi = new Junior('Nnamdi', 3343);


//Test for Inheritance
describe('1. Testing inheritance', () => {
    test('checks if an Admin does not inherits from the User prototype chain', () => {
        expect(User.prototype.isPrototypeOf(Kingsley)).toBeFalsy();
    });
    test('checks if an Admin inherits from the Person prototype chain', () => {
        expect(Person.prototype.isPrototypeOf(Kingsley)).toBeTruthy();
    });
});

//Tests the add book function 
describe('2. Test the add book function', () => {
    test('Ensures an admin can add a new book to the library', () => {
        Kingsley.addBook('Decagon HandBook', 'Jeff Wills', 10, '6583-1234');
        expect(library).toContainEqual({
            book: 'Decagon HandBook',
            author: 'Jeff Wills',
            quantity: 10,
            ISBN: '6583-1234'
        });
    });
    test('Ensures an admin can update the number of any book in the library', () => {
        Kingsley.addBook('Decagon HandBook', 'Jeff Wills', 14, '6583-1234');
        expect(library).toContainEqual({
            book: 'Decagon HandBook',
            author: 'Jeff Wills',
            quantity: 24,
            ISBN: '6583-1234'
        });;
    });
    test('Ensures a Teacher cannot add a book to the library', () => {
        expect(() => {
            David.addBook('Hard Labs', 'David Mogbeyi', 20, '5638-2134');
        }).toThrow();
    });
    test('Ensures a Senior cannot add a book to the library', () => {
        expect(() => {
            Ekene.addBook('The art of convincing people', 'Ekene Agu', 8, '3803-3228');
        }).toThrow();
    });
    test('Ensures a Junior cannot add a book to the library', () => {
        expect(() => {
            Dare.addBook('Redemption', 'Dare Lawal', 8, '4932-3030');
        }).toThrow();
    });
});

describe('3. Testing the handleRequest function', () => {
    test('Ensures an Admin can issue books in the library', () => {
        Austin.requestBook('War-Ship', 'Jeff Willams');
        Kingsley.handleRequest();
        expect(givenBook).toContainEqual({
            name: 'Austin',
            id: 1123,
            book: 'War-Ship',
            author: 'Jeff Willams',
            priority: '1'
        });
    });
    test('Ensures an Admin cannot issue books not in the library', () => {
        Nnamdi.requestBook('Growth', 'Geofrey Dome');
        Kingsley.handleRequest();
        expect(givenBook).not.toContainEqual({
            name: 'Nnamdi',
            id: 3343,
            book: 'Growth',
            author: 'Geofrey Dome',
            priority: '3'
        });
    });
    test('Ensures an Admin issues a book remaining one copy based on the first request from teachers', () => {
        Kingsley.addBook('DecaDev Guide', 'HR', 1, '9324-5484');
        David.requestBook('DecaDev Guide', 'HR');
        Austin.requestBook('DecaDev Guide', 'HR');
        Kingsley.handleRequest();
        expect(givenBook).toContainEqual({
            name: 'David',
            id: 2345,
            book: 'DecaDev Guide',
            author: 'HR',
            priority: '1'
        });
        expect(givenBook).not.toContainEqual({
            name: 'Austin',
            id: 1123,
            book: 'DecaDev Guide',
            author: 'HR',
            priority: '1'
        });
    });
    test('Ensures an Admin issues a book remaining one copy based on the first request from Senior Students', () => {
        Kingsley.addBook('The Wolf', 'James Hills', 1, '3690-5484');
        Ekene.requestBook('The Wolf', 'James Hills');
        Eniola.requestBook('The Wolf', 'James Hills');
        Kingsley.handleRequest();
        expect(givenBook).toContainEqual({
            name: 'Ekene',
            id: 5434,
            book: 'The Wolf',
            author: 'James Hills',
            priority: '2'
        });
        expect(givenBook).not.toContainEqual({
            name: 'Eniola',
            id: 6445,
            book: 'The Wolf',
            author: 'James Hills',
            priority: '2'
        });
    });
    test('Ensures an Admin issues a book remaining one copy based on the first request from Junior Students', () => {
        Kingsley.addBook('Wilderness', 'Godfrey Wills', 1, '3690-8979');
        Nnamdi.requestBook('Wilderness', 'Godfrey Wills');
        Dare.requestBook('Wilderness', 'Godfrey Wills');
        Kingsley.handleRequest();
        expect(givenBook).toContainEqual({
            name: 'Nnamdi',
            id: 3343,
            book: 'Wilderness',
            author: 'Godfrey Wills',
            priority: '3'
        });
        expect(givenBook).not.toContainEqual({
            name: 'Dare',
            id: 6543,
            book: 'Wilderness',
            author: 'Godfrey Wills',
            priority: '3'
        });
    });
    test('Ensures an Admin issues a book remaining one copy to Teachers before students, even when the students ordered first', () => {
        Kingsley.addBook('Heaven', 'Peter Dame', 1, '4983-8979');
        Nnamdi.requestBook('Heaven', 'Peter Dame');
        Ekene.requestBook('Heaven', 'Peter Dame');
        Austin.requestBook('Heaven', 'Peter Dame');
        Kingsley.handleRequest();
        expect(givenBook).toContainEqual({
            name: 'Austin',
            id: 1123,
            book: 'Heaven',
            author: 'Peter Dame',
            priority: '1'
        });
        expect(givenBook).not.toContainEqual({
            name: 'Ekene',
            id: 5434,
            book: 'Heaven',
            author: 'Peter Dame',
            priority: '2'
        });
        expect(givenBook).not.toContainEqual({
            name: 'Nnamdi',
            id: 3343,
            book: 'Heaven',
            author: 'Peter Dame',
            priority: '3'
        });
    });
    test('Ensures an Admin issues a book remaining one copy to Senior Students before Juniors, even when the Junior student ordered first', () => {
        Kingsley.addBook('The Team Lead', 'Bruce Wayne', 1, '4983-0988');
        Nnamdi.requestBook('The Team Lead', 'Bruce Wayne');
        Ekene.requestBook('The Team Lead', 'Bruce Wayne');
        Kingsley.handleRequest();
        expect(givenBook).toContainEqual({
            name: 'Ekene',
            id: 5434,
            book: 'The Team Lead',
            author: 'Bruce Wayne',
            priority: '2'
        });
        expect(givenBook).not.toContainEqual({
            name: 'Nnamdi',
            id: 3343,
            book: 'The Team Lead',
            author: 'Bruce Wayne',
            priority: '3'
        });
    });
});
