// @/helpers/input-validation.ts

export const isValidInput = (input: string): boolean => {
    return input.trim().length > 0;
};
