console.log(isNumber("test"));
console.log(isNumber("1"));

function isNumber(value: string | number): boolean
{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}