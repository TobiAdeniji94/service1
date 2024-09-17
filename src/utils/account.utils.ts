export const generateAccountNumber = (): string => {
    const prefix = '100'; // You can set any prefix
    const uniqueNumber = Date.now().toString().slice(-6); // Using timestamp to generate a unique part
    return prefix + uniqueNumber;
  };
  