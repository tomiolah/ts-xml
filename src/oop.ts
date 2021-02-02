import { XMLAttributes, XMLAttributeValue, XMLNodeType } from "./types";

export default class XMLNode implements XMLNodeType {

  name: string;
  value: (XMLNode | string | number)[];
  attributes: XMLAttributes;

  constructor(name: string, options?: {
    value?: (XMLNode | string | number)[];
    attributes?: XMLAttributes;
  }) {
    this.name = name;
    this.value = options?.value ?? [];
    this.attributes = { ...options?.attributes };
  }

  setAttribute(attributeKey: string, attributeValue: XMLAttributeValue) {
    return new XMLNode(this.name, {
      value: this.value,
      attributes: {
        ...this.attributes,
        [attributeKey]: attributeValue,
      }
    })
  }

  filterAttributes(filterFn: (attribute: {
    key: string;
    value: XMLAttributeValue;
  }) => boolean) {
    return new XMLNode(this.name, {
      value: this.value,
      attributes: {
        ...Object
          .keys(this.attributes)
          .map(v => ({ key: v, value: this.attributes[v] }))
          .filter(filterFn)
          .map(k => ({ [k.key]: k.value }))
          .reduce((p, c) => ({ ...p, ...c }), {}),
      },
    });
  }

  unsetAttribute(attributeKey: string) {
    return this.filterAttributes((item) => item.key !== attributeKey)
  }

  setNodeAttributes(attributes: XMLAttributes) {
    return new XMLNode(this.name, {
      value: this.value,
      attributes: { ...attributes },
    });
  }
  
  appendAttributes(attributes: XMLAttributes) {
    return new XMLNode(this.name, {
      value: this.value,
      attributes: {
        ...this.attributes,
        ...attributes,
      },
    });
  }
  
  prependAttributes(attributes: XMLAttributes) {
    return new XMLNode(this.name, {
      value: this.value,
      attributes: {
        ...attributes,
        ...this.attributes,
      },
    });
  }

  setNodeValues(values: (XMLNode | string | number)[]) {
    return new XMLNode(this.name, {
      value: values,
      attributes: this.attributes,
    });
  }
  
  appendValues(values: (XMLNode | string | number)[]) {
    return new XMLNode(this.name, {
      value: [...this.value, ...values],
      attributes: this.attributes,
    });
  }
  
  prependValues(values: (XMLNode | string | number)[]) {
    return new XMLNode(this.name, {
      value: [...values, ...this.value],
      attributes: this.attributes,
    });
  }
  
  appendValue(value: XMLNode | string | number) {
    return new XMLNode(this.name, {
      value: [...this.value, value],
      attributes: this.attributes,
    });
  }
  
  prependValue(value: XMLNode | string | number) {
    return new XMLNode(this.name, {
      value: [...this.value, value],
      attributes: this.attributes,
    });
  }
  
  filterValues(filterFn: (value: XMLNode | string | number) => boolean) {
    return new XMLNode(this.name, {
      value: this.value.filter(filterFn),
      attributes: this.attributes,
    });
  }

  printNode(options?: {
    indent?: number;
    indentIncrement?: number;
    shortHand?: boolean;
    newLines?: boolean
  }): string {

    const indent = options?.indent ?? 0;
    const indentIncrement = options?.indentIncrement ?? 0;
    const shortHand = options?.shortHand ?? false;
    const newLines = options?.newLines ?? false;

    const indentation = indent > 0 ? Array(indent).fill(' ').map(() => ' ').join('') : '';
    const indentationPlusOne = Array(indent + indentIncrement).fill(' ').map(() => ' ').join('');

    const attributesAsString = 
      Object.keys(this.attributes).length > 0
      ? [ '', ...Object
          .keys(this.attributes)
          .map(k => `${k}="${
            `${this.attributes[k]}`.replace('"', '\\"')
          }"`)
        ].join(' ')
      : '';

    if (shortHand && this.value.length === 0) {
      return `${indentation}<${this.name}${attributesAsString} />`
    }

    return `${indentation}<${this.name}${attributesAsString}>${
      newLines ? '\n' : ''
    }${
      this.value.map(c =>
        typeof c === 'string'
        ? `${indentationPlusOne}${c}`
        : typeof c === 'number'
          ? `${indentationPlusOne}${c}`
          : c.printNode({
              indent: indent + indentIncrement,
              indentIncrement,
              shortHand,
              newLines,
            })
        ).join(newLines ? '\n' : '')
    }${newLines ? '\n' : ''}${indentation}</${this.name}>`;
  }

};