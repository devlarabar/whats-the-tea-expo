export interface Herb {
    name: string;
    name_scientific: string;
    uses: string;
    side_effects: string;
    interactions: string;
    is_caffeinated: boolean;
}

export interface Addon {
    name: string;
    uses: string;
    is_caffeinated: boolean;
}

export interface Recipe {
    id: number;
    name: string;
    herbs: string;
    addons: string;
    is_favourite: boolean;
}

export interface ColorsDict {
    text: string;
    background: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
    primary: string;
    accent1: string;
    accent2: string;
    accent3: string;
}