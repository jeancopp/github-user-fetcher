interface Person {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
}

const a : Person = {
    firstName: 'Joe',
    lastName: 'Doe',
    email: 'joe@doe.com',
    age: 35,
}

console.log(a);
console.log({...a}, "Linha gigantesca com mais de 80 caracteres para ver se o esling vai xiar de tanto aracter aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
