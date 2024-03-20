import { isBlacklisted, isEnglish } from './wording';

describe('isEnglish function', () => {
  test('it should return true for a valid English string', () => {
    expect(isEnglish('hello')).toBe(true);
  });

  test('it should return true for a valid English string with tld', () => {
    expect(isEnglish('foo.jfin')).toBe(true);
  });

  test('it should return false for a non-English string with tld', () => {
    expect(isEnglish('กกก.jfin')).toBe(false);
  });

  test('it should return false for a string with non-printable ASCII characters', () => {
    expect(isEnglish('Helloกก')).toBe(false);
  });
});

describe('isBlacklisted function', () => {
  test('it should return true for a blacklisted word', () => {
    expect(isBlacklisted('This contains a bad word: crap')).toBe(true);
  });

  test('it should return true for a blacklisted word regardless of case', () => {
    expect(isBlacklisted('This contains a bad word: CrAp')).toBe(true);
  });

  test('it should return true for a blacklisted word with tld', () => {
    expect(isBlacklisted('fuk.jfin')).toBe(true);
  });

  test('it should return false for a string without blacklisted words', () => {
    expect(isBlacklisted('clean.jfin')).toBe(false);
  });

  test('it should return false for an empty string', () => {
    expect(isBlacklisted('')).toBe(false);
  });
});
