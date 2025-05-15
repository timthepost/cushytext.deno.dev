/**
 * SimpleConforms - Process string checks based on natural language
 * This is part of SimpleSEO, which is part of CushyText - A theme For
 * Lume 3: https://cushytext.deno.dev
 * License: MIT
 */

/**
 * Defines the units that can be used for length/count requirements.
 * - `character`: Raw character count.
 * - `grapheme`: User-perceived characters (e.g., "👍🏽" is one grapheme).
 * - `word`: Words, segmented by locale.
 * - `sentence`: Sentences, segmented by locale.
 * - `number`: Treats the input as a numerical value (for percentages)
 */
export type LengthUnit =
  | "character"
  | "grapheme"
  | "word"
  | "sentence"
  | "number";

/**
 * Checks are powered by a simple natural language nomenclature, e.g.
 * "range 80 100 grapheme". Mostly, we care if the given content conforms
 * to this set of bounds or not, and if not, why not. That's what goes
 * into a requirement check. This stores all of that.
 */
export interface RequirementResult {
  conforms: boolean;
  actualValue: number;
  unit: LengthUnit;
  message?: string;
  originalNomenclature: string;
}

interface ParsedRequirement {
  type: "min" | "max" | "range";
  value1: number;
  value2?: number; // for "range"
  unit: LengthUnit;
  originalNomenclature: string;
}

export class SimpleConforms {
  private requirement: ParsedRequirement;
  private locale: string;

  constructor(nomenclature: string, locale: string = "en") {
    this.locale = locale;
    this.requirement = this.parseNomenclature(nomenclature);
  }

  private parseNomenclature(nomenclature: string): ParsedRequirement {
    const originalNomenclature = nomenclature;
    nomenclature = nomenclature.trim().toLowerCase();
    // Regex for "min <val> <unit>" or "max <val> <unit>"
    const minMaxPattern =
      /^(min|max)\s+(\d+)\s+(character|grapheme|word|sentence|number)$/;
    // Regex for "range <val1> <val2> <unit>"
    const rangePattern =
      /^range\s+(\d+)\s+(\d+)\s+(character|grapheme|word|sentence|number)$/;

    let match = nomenclature.match(minMaxPattern);
    if (match) {
      return {
        type: match[1] as "min" | "max",
        value1: parseInt(match[2], 10),
        unit: match[3] as LengthUnit,
        originalNomenclature,
      };
    }

    match = nomenclature.match(rangePattern);
    if (match) {
      const val1 = parseInt(match[1], 10);
      const val2 = parseInt(match[2], 10);
      return {
        type: "range",
        value1: Math.min(val1, val2),
        value2: Math.max(val1, val2),
        unit: match[3] as LengthUnit,
        originalNomenclature,
      } as ParsedRequirement;
    }

    /**
     * If using outside of Lume, you should just throw here instead. I do
     * this only to not interrupt the entire site build.
     */
    console.error(
      `SimpleConforms: Unable to process nomenclature: ${nomenclature}`,
    );
    return null as unknown as ParsedRequirement;
  }

  /**
   * A utility to count dang near anything. Not exactly pretty, but
   * effective! Number reflects the requirement unit.
   * @param textOrNumber text, number or array
   * @returns number
   */
  private getActualValue(
    textOrNumber: string | number | Array<string> | null | undefined,
  ): number {
    if (textOrNumber === null || textOrNumber === undefined) return 0;

    // meta description count
    if (Array.isArray(textOrNumber)) {
      return textOrNumber.length;
    }

    if (this.requirement.unit === "number") {
      if (typeof textOrNumber === "number") return textOrNumber;
      const num = parseFloat(String(textOrNumber));
      return isNaN(num) ? 0 : num;
    }

    const text = String(textOrNumber);

    if (text === "") return 0; // "max 0 characters" is a valid test for existence
    if (this.requirement.unit === "character") return text.length;

    const segmenterUnit = this.requirement.unit as
      | "grapheme"
      | "word"
      | "sentence";
    const segmenter = new Intl.Segmenter(this.locale, {
      granularity: segmenterUnit,
    });
    return Array.from(segmenter.segment(text)).length;
  }

  public test(
    inputValue: string | number | Array<string> | null | undefined,
    context: string = "",
  ): RequirementResult {
    const actualValue = this.getActualValue(inputValue);
    let conforms = false;
    let message: string | undefined;

    switch (this.requirement.type) {
      case "min":
        conforms = actualValue >= this.requirement.value1;
        if (!conforms) {
          message =
            `${context}: Value ${actualValue} ${this.requirement.unit}(s) is less than minimum ${this.requirement.value1}.`;
        }
        break;
      case "max":
        conforms = actualValue <= this.requirement.value1;
        if (!conforms) {
          message =
            `${context}: Value ${actualValue} ${this.requirement.unit}(s) exceeds maximum ${this.requirement.value1}.`;
        }
        break;
      case "range":
        conforms = actualValue >= this.requirement.value1 &&
          actualValue <= this.requirement.value2!;
        if (!conforms) {
          message =
            `${context}: Value ${actualValue} ${this.requirement.unit}(s) is outside the range ${this.requirement.value1}-${this
              .requirement.value2!}.`;
        }
        break;
    }
    return {
      conforms,
      actualValue,
      unit: this.requirement.unit,
      message,
      originalNomenclature: this.requirement.originalNomenclature,
    };
  }
}
