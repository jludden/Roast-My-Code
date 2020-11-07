import faker from 'faker';

export const generateUserName = () => {
    return faker.name.findName();
}
