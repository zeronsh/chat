export function Title({ title }: { title?: string | null }) {
    return <title>{title ?? 'Zeron'}</title>;
}
