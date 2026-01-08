/**
 * Index Dosyası - Barrel Export Pattern
 * 
 * 📚 AÇIKLAMA:
 * Bu dosya, tüm bileşenleri tek bir yerden export eder.
 * 
 * KULLANIM FARKI:
 * 
 * Bu dosya OLMADAN:
 * import { CharacterBox } from "@/components/form-template/CharacterBox";
 * import { CheckboxField } from "@/components/form-template/CheckboxField";
 * 
 * Bu dosya İLE:
 * import { CharacterBox, CheckboxField } from "@/components/form-template";
 * 
 * Daha temiz ve yönetilebilir!
 */

export { CharacterBox } from "./CharacterBox";
export { CheckboxField } from "./CheckboxField";
export { FormSection } from "./FormSection";
export { TextLine } from "./TextLine";
export { PatientRegistrationForm } from "./PatientRegistrationForm";
