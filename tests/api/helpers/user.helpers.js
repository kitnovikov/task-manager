import {Faker, ru} from '@faker-js/faker';

const faker = new Faker({ locale: ru })

export const randomFirstName = () => faker.person.firstName()

export const randomLastName = () => faker.person.lastName()

export const randomEmail = () => faker.internet.email()

export const randomPassword = () => faker.helpers.fromRegExp(/[a-z]{3}[A-Z]{1}[0-9]{2}[!@#$%^&*(),.?":{}|<>+=_-]{8}/)