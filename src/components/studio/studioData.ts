import {
    Shirt, Footprints, ShoppingBag,
    Camera, RefreshCcw, Eye, Info, TrendingUp, AlertTriangle, Ruler
} from 'lucide-react';

export type StudioStep = {
    id: string;
    titleKey: string;
    descKey: string;
    secretKey: string;
    icon: any;
};

export type StudioCategory = {
    id: string;
    nameKey: string;
    icon: any;
    steps: StudioStep[];
};

export const STUDIO_DATA: Record<string, StudioCategory> = {
    vetements: {
        id: 'vetements',
        nameKey: 'cat_clothes',
        icon: Shirt,
        steps: [
            { id: 'cover', titleKey: 'step_cover_t', descKey: 'step_cover_d', secretKey: 'step_cover_s', icon: Camera },
            { id: 'back', titleKey: 'step_back_t', descKey: 'step_back_d', secretKey: 'step_back_s', icon: RefreshCcw },
            { id: 'label_brand', titleKey: 'step_brand_t', descKey: 'step_brand_d', secretKey: 'step_brand_s', icon: Eye },
            { id: 'label_comp', titleKey: 'step_comp_t', descKey: 'step_comp_d', secretKey: 'step_comp_s', icon: Info },
            { id: 'details', titleKey: 'step_details_t', descKey: 'step_details_d', secretKey: 'step_details_s', icon: TrendingUp },
            { id: 'defects', titleKey: 'step_defects_t', descKey: 'step_defects_d', secretKey: 'step_defects_s', icon: AlertTriangle }
        ]
    },
    chaussures: {
        id: 'chaussures',
        nameKey: 'cat_shoes',
        icon: Footprints,
        steps: [
            { id: 'profile', titleKey: 'step_cover_t', descKey: 'step_cover_d', secretKey: 'step_cover_s', icon: Camera },
            { id: 'top', titleKey: 'step_details_t', descKey: 'step_details_d', secretKey: 'step_details_s', icon: Eye },
            { id: 'soles', titleKey: 'step_back_t', descKey: 'step_back_d', secretKey: 'step_back_s', icon: RefreshCcw },
            { id: 'size_tag', titleKey: 'step_brand_t', descKey: 'step_brand_d', secretKey: 'step_brand_s', icon: Ruler },
            { id: 'heels', titleKey: 'step_defects_t', descKey: 'step_defects_d', secretKey: 'step_defects_s', icon: TrendingUp }
        ]
    },
    sacs: {
        id: 'sacs',
        nameKey: 'cat_bags',
        icon: ShoppingBag,
        steps: [
            { id: 'front', titleKey: 'step_cover_t', descKey: 'step_cover_d', secretKey: 'step_cover_s', icon: Camera },
            { id: 'corners', titleKey: 'step_defects_t', descKey: 'step_defects_d', secretKey: 'step_defects_s', icon: AlertTriangle },
            { id: 'interior', titleKey: 'step_brand_t', descKey: 'step_brand_d', secretKey: 'step_brand_s', icon: Eye },
            { id: 'hardware', titleKey: 'step_details_t', descKey: 'step_details_d', secretKey: 'step_details_s', icon: TrendingUp },
            { id: 'scale', titleKey: 'step_comp_t', descKey: 'step_comp_d', secretKey: 'step_comp_s', icon: Ruler }
        ]
    }
};
