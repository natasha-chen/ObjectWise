export const instructionTemplates = {
    kitchenTool: {
        sections: [
            'Safety Check',
            'Preparation',
            'Basic Operation',
            'Cleaning and Maintenance'
        ],
        requiredFields: ['safetyLevel', 'generalWarnings', 'instructions'],
        suggestedTips: [
            'Always read safety warnings first',
            'Keep tools clean and sharp',
            'Store properly after use'
        ]
    },
    
    powerTool: {
        sections: [
            'Safety Equipment Check',
            'Pre-Operation Inspection',
            'Operation Technique',
            'Post-Use Maintenance'
        ],
        requiredFields: ['safetyLevel', 'requiredSafetyEquipment', 'criticalWarnings', 'instructions'],
        suggestedTips: [
            'Always wear appropriate safety gear',
            'Check power source before use',
            'Maintain proper grip and stance',
            'Store in secure location'
        ]
    },
    
    plant: {
        sections: [
            'Light Requirements',
            'Watering Schedule',
            'Feeding and Fertilizing',
            'Pruning and Maintenance'
        ],
        requiredFields: ['instructions', 'maintenance'],
        suggestedTips: [
            'Observe plant regularly for changes',
            'Adjust care based on seasons',
            'Research specific variety needs'
        ]
    },
    
    appliance: {
        sections: [
            'Setup and Installation',
            'Daily Operation',
            'Regular Cleaning',
            'Troubleshooting'
        ],
        requiredFields: ['safetyLevel', 'generalWarnings', 'instructions', 'maintenance'],
        suggestedTips: [
            'Read manual before first use',
            'Follow maintenance schedules',
            'Keep warranty information accessible'
        ]
    },
    
    safetyEquipment: {
        sections: [
            'When to Use',
            'Proper Usage Technique',
            'Emergency Procedures',
            'Inspection and Maintenance'
        ],
        requiredFields: ['criticalWarnings', 'emergencyProcedures', 'instructions'],
        suggestedTips: [
            'Know your equipment before emergency',
            'Regular inspection saves lives',
            'Practice using equipment regularly'
        ]
    },
    
    electronics: {
        sections: [
            'Initial Setup',
            'Basic Operations',
            'Settings Configuration',
            'Care and Maintenance'
        ],
        requiredFields: ['instructions', 'generalWarnings'],
        suggestedTips: [
            'Keep software updated',
            'Protect from water and extreme temperatures',
            'Use original chargers when possible'
        ]
    },
    
    sportsEquipment: {
        sections: [
            'Safety Preparation',
            'Equipment Check',
            'Proper Technique',
            'Storage and Care'
        ],
        requiredFields: ['safetyLevel', 'requiredSafetyEquipment', 'instructions'],
        suggestedTips: [
            'Warm up before use',
            'Check equipment condition regularly',
            'Follow safety guidelines'
        ]
    }
};

export const getTemplateForCategory = (category) => {
    const templateMap = {
        'Kitchen Tools': 'kitchenTool',
        'Power Tools': 'powerTool',
        'Plants': 'plant',
        'Appliances': 'appliance',
        'Safety Equipment': 'safetyEquipment',
        'Electronics': 'electronics',
        'Sports Equipment': 'sportsEquipment',
        'Hand Tools': 'kitchenTool'
    };
    
    return instructionTemplates[templateMap[category]] || instructionTemplates.kitchenTool;
};

export const validateObjectData = (objectData) => {
    const template = getTemplateForCategory(objectData.category);
    const errors = [];
    
    template.requiredFields.forEach(field => {
        if (!objectData[field] || (Array.isArray(objectData[field]) && objectData[field].length === 0)) {
            errors.push(`Missing required field: ${field}`);
        }
    });
    
    if (!objectData.instructions || objectData.instructions.length === 0) {
        errors.push('At least one instruction step is required');
    }
    
    if (objectData.instructions) {
        objectData.instructions.forEach((instruction, index) => {
            if (!instruction.title || !instruction.description) {
                errors.push(`Instruction ${index + 1} missing title or description`);
            }
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

export const generateInstructionSkeleton = (category) => {
    const template = getTemplateForCategory(category);
    
    return {
        id: '',
        name: '',
        category,
        tags: [],
        description: '',
        difficulty: 'Beginner',
        timeEstimate: '5-10 min',
        safetyLevel: 'low',
        image: '',
        commonUses: [],
        materials: [],
        requiredTools: [],
        generalWarnings: [],
        instructions: template.sections.map(section => ({
            title: section,
            description: '',
            timeEstimate: '2-5 min',
            substeps: [],
            tips: [],
            warnings: []
        })),
        maintenance: [],
        storage: '',
        lifespan: '',
        ageRestrictions: {
            minimumAge: '12 years',
            supervisionRequired: false,
            notes: ''
        }
    };
};