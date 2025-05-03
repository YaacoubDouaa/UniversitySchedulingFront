/**
 * Utility class to convert between DTO (Data Transfer Object) and domain models
 */
export class DTOMapper {
  /**
   * Maps data from a DTO to a domain model
   */
  static fromDTO<T extends object, U extends object>(
    dto: T,
    modelType: new () => U,
    mappingConfig?: {
      propertyMap?: { [key: string]: string },
      customMapping?: (dto: T, model: U) => void
    }
  ): U {
    if (!dto) {
      return null as any;
    }

    const model = new modelType();
    const propertyMap = mappingConfig?.propertyMap || {};

    Object.keys(dto).forEach(dtoKey => {
      const modelKey = propertyMap[dtoKey] || dtoKey;
      if (modelKey in model) {
        (model as any)[modelKey] = (dto as any)[dtoKey];
      }
    });

    if (mappingConfig?.customMapping) {
      mappingConfig.customMapping(dto, model);
    }

    return model;
  }

  /**
   * Maps data from a domain model to a DTO
   */
  static toDTO<T extends object, U extends object>(
    model: T,
    dtoType: new () => U,
    mappingConfig?: {
      propertyMap?: { [key: string]: string },
      customMapping?: (model: T, dto: U) => void
    }
  ): U {
    if (!model) {
      return null as any;
    }

    const dto = new dtoType();
    const propertyMap = mappingConfig?.propertyMap || {};

    const inversePropertyMap: { [key: string]: string } = {};
    Object.keys(propertyMap).forEach(dtoKey => {
      inversePropertyMap[propertyMap[dtoKey]] = dtoKey;
    });

    Object.keys(model).forEach(modelKey => {
      const dtoKey = inversePropertyMap[modelKey] || modelKey;
      if (dtoKey in dto) {
        (dto as any)[dtoKey] = (model as any)[modelKey];
      }
    });

    if (mappingConfig?.customMapping) {
      mappingConfig.customMapping(model, dto);
    }

    return dto;
  }

  /**
   * Maps an array of DTOs to an array of domain models
   */
  static fromDTOArray<T extends object, U extends object>(
    dtos: T[],
    modelType: new () => U,
    mappingConfig?: {
      propertyMap?: { [key: string]: string },
      customMapping?: (dto: T, model: U) => void
    }
  ): U[] {
    if (!dtos || !Array.isArray(dtos)) {
      return [];
    }
    return dtos.map(dto => this.fromDTO(dto, modelType, mappingConfig));
  }

  /**
   * Maps an array of domain models to an array of DTOs
   */
  static toDTOArray<T extends object, U extends object>(
    models: T[],
    dtoType: new () => U,
    mappingConfig?: {
      propertyMap?: { [key: string]: string },
      customMapping?: (model: T, dto: U) => void
    }
  ): U[] {
    if (!models || !Array.isArray(models)) {
      return [];
    }
    return models.map(model => this.toDTO(model, dtoType, mappingConfig));
  }
}
