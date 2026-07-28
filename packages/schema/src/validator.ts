import type {
  CollectionDefinition,
  GlobalDefinition,
  ComponentDefinition,
  FieldDefinition,
} from "@blaze-cms/types";

export interface ValidationError {
  path: string;
  message: string;
}

export class SchemaValidator {
  validateCollection(collection: CollectionDefinition): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!collection.slug) {
      errors.push({ message: "Collection slug is required", path: "slug" });
    }
    if (!collection.labels.singular) {
      errors.push({ message: "Singular label is required", path: "labels.singular" });
    }
    if (!collection.labels.plural) {
      errors.push({ message: "Plural label is required", path: "labels.plural" });
    }
    if (collection.fields.length === 0) {
      errors.push({ message: "At least one field is required", path: "fields" });
    }
    for (const field of collection.fields) {
      errors.push(...this.validateField(field, `fields.${field.name}`));
    }
    return errors;
  }

  validateGlobal(global: GlobalDefinition): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!global.slug) {
      errors.push({ message: "Global slug is required", path: "slug" });
    }
    if (!global.label) {
      errors.push({ message: "Label is required", path: "label" });
    }
    for (const field of global.fields) {
      errors.push(...this.validateField(field, `fields.${field.name}`));
    }
    return errors;
  }

  validateComponent(component: ComponentDefinition): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!component.slug) {
      errors.push({ message: "Component slug is required", path: "slug" });
    }
    if (!component.label) {
      errors.push({ message: "Label is required", path: "label" });
    }
    for (const field of component.fields) {
      errors.push(...this.validateField(field, `fields.${field.name}`));
    }
    return errors;
  }

  private validateField(field: FieldDefinition, path: string): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!field.name) {
      errors.push({ message: "Field name is required", path });
    }
    if (field.type === "select" || field.type === "multiSelect" || field.type === "radio") {
      if (field.options.length === 0) {
        errors.push({
          message: "Options are required for select/multiSelect/radio fields",
          path: `${path}.options`,
        });
      }
    }
    if (field.type === "relation" && !field.to) {
      errors.push({
        message: "Target collection is required for relation fields",
        path: `${path}.to`,
      });
    }
    if (field.type === "component" && !field.component) {
      errors.push({
        message: "Component slug is required for component fields",
        path: `${path}.component`,
      });
    }
    return errors;
  }
}
