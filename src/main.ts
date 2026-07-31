function banner(product: string, moto: string): string {
  return `${product}: ${moto}`;
}

const message = banner('Savant', 'Learn anything. Then retain it for life.');
console.log(message);
