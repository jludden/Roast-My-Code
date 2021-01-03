import generate from 'project-name-generator';

export const generateUserName = (): string => {
    return generate({ words: 2, alliterative: false }).raw.join('_');
}

export const generateAvatar = (): number => {
    return randomLessThan(10);
}

const randomLessThan = (max: number): number => {
    max = Math.floor(max);
    return Math.floor(Math.random() * max);
}