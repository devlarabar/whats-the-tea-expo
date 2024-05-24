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