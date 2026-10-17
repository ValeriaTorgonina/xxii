import { useEffect, useRef, useState } from 'react';
import { rewardedAdService } from '../model/services/rewardedAdService';

export function useRewardedComparison() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'showing'>('idle');
  const [unlocked, setUnlocked] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [message, setMessage] = useState('');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);

  const cancel = () => {
    pending.current?.abort();
    pending.current = null;
    setStatus('idle');
    setMessage('Загрузка отменена. Можно продолжить обычную практику.');
  };

  const unlock = async () => {
    if (pending.current || unlocked || !rewardedAdService.available) return;
    const controller = new AbortController();
    pending.current = controller;
    setStatus('loading');
    setMessage('');
    try {
      const earned = await rewardedAdService.show(controller.signal, () => setStatus('showing'));
      if (controller.signal.aborted) return;
      if (earned) setUnlocked(true);
      else setMessage('Просмотр не завершён. Сравнение пока закрыто — можно попробовать ещё раз.');
    } catch {
      if (!controller.signal.aborted) setMessage('Сейчас реклама недоступна. Попробуй позже; обычная практика доступна как всегда.');
    } finally {
      if (!controller.signal.aborted) {
        pending.current = null;
        setStatus('idle');
      }
    }
  };

  return { available: rewardedAdService.available, status, unlocked, answerVisible, setAnswerVisible, message, unlock, cancel };
}
