import { useMemo, useState } from 'react';
import { MAJOR_ARCANA } from '@/lib/tarot-data';
import { GROUPS } from '../constants/groups';
import { useRewardedComparison } from '@/src/modules/rewardedPractice/public';
type Mode = 'learn' | 'practice';
type Orientation = 'upright' | 'reversed';

export function useCatalog() {
  const comparison = useRewardedComparison();
  const [mode, setMode] = useState<Mode>('learn');
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<(typeof GROUPS)[number]['key']>('all');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [orientation, setOrientation] = useState<Orientation>('upright');
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  const practiceCard = MAJOR_ARCANA[practiceIndex % MAJOR_ARCANA.length];

  const filteredCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return MAJOR_ARCANA.filter((card, index) => {
      const matchesGroup =
        group === 'all' ||
        (group === '0-7' && index <= 7) ||
        (group === '8-14' && index >= 8 && index <= 14) ||
        (group === '15-21' && index >= 15);
      const matchesQuery =
        !normalizedQuery ||
        card.name.toLowerCase().includes(normalizedQuery) ||
        card.number.toLowerCase().includes(normalizedQuery) ||
        card.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery)) ||
        card.archetype.toLowerCase().includes(normalizedQuery) ||
        card.upright.toLowerCase().includes(normalizedQuery);

      return matchesGroup && matchesQuery;
    });
  }, [group, query]);

  const dayCard = useMemo(() => {
    const daySeed = new Date().toISOString().slice(0, 10);
    const index = [...daySeed].reduce((total, char) => total + char.charCodeAt(0), 0);
    return MAJOR_ARCANA[index % MAJOR_ARCANA.length];
  }, []);

  const nextPracticeCard = () => {
    const nextIndex = (practiceIndex + 1) % MAJOR_ARCANA.length;
    setPracticeIndex(nextIndex);
    setOrientation(nextIndex % 3 === 0 ? 'reversed' : 'upright');
    setIsAnswerVisible(false);
  };

  return { mode, setMode, query, setQuery, group, setGroup, filteredCards, dayCard, practiceCard, orientation, isAnswerVisible, setIsAnswerVisible, nextPracticeCard, comparison };
}
