import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';

interface CmsMastheadProps {
  count: number;
  lastUpdatedAt: Date | null;
}

function LastEditText({ date }: { date: Date | null }) {
  const { t, i18n } = useTranslation();
  if (!date) return null;
  const locale = i18n.language === 'en' ? enUS : es;
  const distance = formatDistanceToNow(date, { addSuffix: true, locale });
  return <span>{t('cms.lastEdited', { distance })}</span>;
}

function MetaLine({ count, lastUpdatedAt }: { count: number; lastUpdatedAt: Date | null }) {
  const { t } = useTranslation();
  return (
    <p className="text-sm text-muted-foreground">
      {count} {count === 1 ? t('cms.entry') : t('cms.entries')}{' '}
      <LastEditText date={lastUpdatedAt} />
    </p>
  );
}

export function CmsMasthead({ count, lastUpdatedAt }: CmsMastheadProps) {
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl">
          {t('cms.title')}
        </h2>
        <MetaLine count={count} lastUpdatedAt={lastUpdatedAt} />
      </div>
      <Separator />
    </div>
  );
}
