import generate from 'project-name-generator';
import { AvatarGenerator } from 'random-avatar-generator';

export const generateUserName = (): string => {
    return generate({ words: 2, alliterative: false }).raw.join('_');
}

export const generateAvatar = (): string => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
}

const randomLessThan = (max: number): number => {
    max = Math.floor(max);
    return Math.floor(Math.random() * max);
}