
export type XMLAttributeValue = string | number;

export type XMLAttributes = {
  [key: string]: XMLAttributeValue;
}

export type XMLNodeType = {
  name: string;
  value: (XMLNodeType | string | number)[];
  attributes: XMLAttributes;
};
