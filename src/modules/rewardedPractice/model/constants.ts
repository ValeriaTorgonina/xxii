import { MAJOR_ARCANA } from '@/lib/tarot-data';

// Stable IDs reuse the application's existing meanings and artwork registry.
export const COMPARISON_CARDS = MAJOR_ARCANA.filter(card => card.id === 'fool' || card.id === 'magician');
export const COMPARISON_PROMPT = 'Ты хочешь начать новое дело. Какая карта предлагает довериться неизвестному, а какая — собрать инструменты и действовать осознанно?';
export const COMPARISON_ANSWER = 'Шут — открытость новому и первый шаг без готового плана. Маг — намерение, навык и использование доступных средств. Обе карты связаны с началом, но Шут исследует возможности, а Маг направляет энергию в конкретное действие.';
