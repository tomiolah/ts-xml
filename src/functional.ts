import { XMLAttributes, XMLAttributeValue, XMLNodeType } from "./types";

export default function XMLNode(name: string, options?: {
  value?: (XMLNodeType | string | number)[];
  attributes?: XMLAttributes;
}): XMLNodeType {
  return ({
    name,
    value: options?.value ?? [],
    attributes: { ...options?.attributes },
  });
}

export const unsetAttribute = (node: XMLNodeType, attributeKey: string) =>
  filterAttributes(node, (item) => item.key !== attributeKey);

export const setAttribute = (node: XMLNodeType, attributeKey: string, attributeValue: XMLAttributeValue) => ({
  name: node.name,
  value: node.value,
  attributes: {
    ...node.attributes,
    [attributeKey]: attributeValue,
  },
} as XMLNodeType);

export const setNodeAttributes = (node: XMLNodeType, attributes: XMLAttributes) => ({
  name: node.name,
  value: node.value,
  attributes: { ...attributes },
} as XMLNodeType);

export const appendAttributes = (node: XMLNodeType, attributes: XMLAttributes) => ({
  name: node.name,
  value: node.value,
  attributes: {
    ...node.attributes,
    ...attributes,
  },
} as XMLNodeType);

export const prependAttributes = (node: XMLNodeType, attributes: XMLAttributes) => ({
  name: node.name,
  value: node.value,
  attributes: {
    ...attributes,
    ...node.attributes,
  },
} as XMLNodeType);

export const filterAttributes = (node: XMLNodeType, filterFn: (attribute: {
  key: string;
  value: XMLAttributeValue;
}) => boolean) => ({
  name: node.name,
  value: node.value,
  attributes: {
    ...Object
      .keys(node.attributes)
      .map(v => ({ key: v, value: node.attributes[v] }))
      .filter(filterFn)
      .map(k => ({ [k.key]: k.value }))
      .reduce((p, c) => ({ ...p, ...c }), {}),
  },
} as XMLNodeType);

export const setNodeValues = (node: XMLNodeType, values: (XMLNodeType | string | number)[]) => ({
  name: node.name,
  value: values,
  attributes: node.attributes,
} as XMLNodeType);

export const appendValues = (node: XMLNodeType, values: (XMLNodeType | string | number)[]) => ({
  name: node.name,
  value: [...node.value, ...values],
  attributes: node.attributes,
} as XMLNodeType);

export const prependValues = (node: XMLNodeType, values: (XMLNodeType | string | number)[]) => ({
  name: node.name,
  value: [...values, ...node.value],
  attributes: node.attributes,
} as XMLNodeType);

export const appendValue = (node: XMLNodeType, value: XMLNodeType | string | number) => ({
  name: node.name,
  value: [...node.value, value],
  attributes: node.attributes,
} as XMLNodeType);

export const prependValue = (node: XMLNodeType, value: XMLNodeType | string | number) => ({
  name: node.name,
  value: [...node.value, value],
  attributes: node.attributes,
} as XMLNodeType);

export const filterValues = (node: XMLNodeType, filterFn: (value: XMLNodeType | string | number) => boolean) => ({
  name: node.name,
  value: node.value.filter(filterFn),
  attributes: node.attributes,
} as XMLNodeType);

const printNode = (node: XMLNodeType, {
  indent = 0,
  indentIncrement = 0,
  shortHand = false,
  newLines = false,
}: {
  indent?: number;
  indentIncrement?: number;
  shortHand?: boolean;
  newLines?: boolean
}): string => {
  const indentation = indent > 0 ? Array(indent).fill(' ').map(() => ' ').join('') : '';
  const attributesAsString = Object
  .keys(node.attributes).length > 0 ? [
    '',
    ...Object
      .keys(node.attributes)
      .map(k => `${k}="${
        `${node.attributes[k]}`.replace('"', '\\"')
      }"`)
    ].join(' ') : '';
  if (shortHand && node.value.length === 0) {
    return `${indentation}<${node.name}${attributesAsString} />`
  }
  return `${indentation}<${node.name}${attributesAsString}>${
    newLines ? '\n' : ''
  }${
    node.value
      .map(c => printXMLDocument(c, {
        indent: indent + indentIncrement,
        indentIncrement,
        shortHand,
        newLines,
      }))
      .join(newLines ? '\n' : '')
  }${newLines ? '\n' : ''}${indentation}</${node.name}>`
}

export const printXMLDocument = (node: XMLNodeType | string | number, options?: {
  indent?: number;
  indentIncrement?: number;
  shortHand?: boolean;
  newLines?: boolean
}): string => {
  const indent = options?.indent ?? 0;
  const indentIncrement = options?.indentIncrement ?? 0;
  const shortHand = options?.shortHand ?? false;
  const newLines = options?.newLines ?? false;
  const indentation = indent > 0 ? Array(indent).fill(' ').map(() => ' ').join('') : '';
  switch (typeof node) {
    case 'string':
      return `${indentation}${node}`;
    case 'number':
      return `${indentation}${node}`;
    default:
      return printNode(node, {
        indent,
        indentIncrement,
        shortHand,
        newLines,
      });
  }
}