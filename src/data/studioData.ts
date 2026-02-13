// Data for studio categories - Pure logic extraction
export const studioData = {
    vetements: {
        id: 'vetements',
        icon: 'shirt',
        steps: [
            { id: 'cover', icon: 'camera' },
            { id: 'back', icon: 'refresh-cw' },
            { id: 'label_brand', icon: 'tag' },
            { id: 'label_comp', icon: 'file-text' },
            { id: 'details', icon: 'zoom-in' },
            { id: 'defects', icon: 'alert-triangle' }
        ]
    },
    chaussures: {
        id: 'chaussures',
        icon: 'footprints',
        steps: [
            { id: 'profile', icon: 'camera' },
            { id: 'top', icon: 'arrow-down' },
            { id: 'soles', icon: 'refresh-cw' },
            { id: 'size_tag', icon: 'ruler' },
            { id: 'heels', icon: 'alert-triangle' }
        ]
    },
    sacs: {
        id: 'sacs',
        icon: 'shopping-bag',
        steps: [
            { id: 'front', icon: 'camera' },
            { id: 'corners', icon: 'alert-triangle' },
            { id: 'interior', icon: 'folder-open' },
            { id: 'hardware', icon: 'link' },
            { id: 'scale', icon: 'ruler' }
        ]
    }
} as const;

export type CategoryKey = keyof typeof studioData;
