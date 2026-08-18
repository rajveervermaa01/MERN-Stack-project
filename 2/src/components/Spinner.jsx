export default function Spinner({ size = 'md' }) {
    return <span className={size === 'lg' ? 'spinner spinner-lg' : 'spinner'} />;
}
