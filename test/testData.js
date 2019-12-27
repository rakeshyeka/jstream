import uuid1 from 'uuid/v1';

export const randomInt = (a=0, b=1000) => {
    return a + Math.floor((b-a)*Math.random());
}

export const randomBool = () => {
    return randomInt() % 2 == 0;
}

export const randomString = () => {
    return uuid1();
}
