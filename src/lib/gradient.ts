import { seededRandom } from '@/lib/utils';

export function getGradientClass(input: string): string {
    // Convert string to numeric seed
    let numericSeed = 0;
    for (let i = 0; i < input.length; i++) {
        numericSeed += input.charCodeAt(i) * (i + 1);
    }
    const rng = seededRandom(numericSeed);

    // 16 beautiful preset gradients
    const presetGradients = [
        'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
        'bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600',
        'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
        'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500',
        'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500',
        'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600',
        'bg-gradient-to-br from-orange-400 via-pink-500 to-red-600',
        'bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600',
        'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600',
        'bg-gradient-to-br from-violet-400 via-purple-500 to-blue-600',
        'bg-gradient-to-br from-amber-400 via-orange-500 to-red-600',
        'bg-gradient-to-br from-teal-400 via-green-500 to-blue-600',
        'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600',
        'bg-gradient-to-br from-lime-400 via-emerald-500 to-cyan-600',
        'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-600',
        'bg-gradient-to-br from-red-400 via-orange-500 to-yellow-600',
    ];

    // Pick a gradient based on the seeded random
    const gradientIndex = Math.floor(rng() * presetGradients.length);
    return presetGradients[gradientIndex];
}
