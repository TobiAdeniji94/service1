export const generateAccountNumber = (): string => {
    const prefix = '100';
    const uniqueNumber = Date.now().toString().slice(-7); // Using timestamp to generate a unique part
    return prefix + uniqueNumber;
  };
  