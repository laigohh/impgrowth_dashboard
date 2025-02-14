import { db } from "../src/db/client"
import { facebookGroups } from "../src/db/schema"

async function seed() {
    try {
        await db.insert(facebookGroups).values([
            { name: 'Digital Faceless Queens', url: 'https://www.facebook.com/groups/461037856544830' },
            { name: 'Women Learning to Lead in Business', url: 'https://www.facebook.com/groups/1114978673633491' },
            { name: 'Women Entrepreneurs & Digital Product Success', url: 'https://www.facebook.com/groups/9362107010471392' },
            { name: 'Digital Marketing / Digital Products Playground', url: 'https://www.facebook.com/groups/1727010741391730' },
            { name: 'Digital Marketing Promo Network', url: 'https://www.facebook.com/groups/527796609857325' },
            { name: 'WFH Moms & Online Hustles', url: 'https://www.facebook.com/groups/1138736687836465' },
            { name: 'Digital Marketing Girl Boss', url: 'https://www.facebook.com/groups/939906811424324' },
            { name: 'Millionaire Mompreneurs Hub', url: 'https://www.facebook.com/groups/1618269535741586' },
            { name: 'Women Entrepreneurs Success Circle', url: 'https://www.facebook.com/groups/614384310936686' },
            { name: 'Women Entrepreneurs in Online Business', url: 'https://www.facebook.com/groups/2063709847400243' },
            { name: 'Women Learning & Growing Together', url: 'https://www.facebook.com/groups/579039344984304' },
            { name: 'The Female Entrepreneur Collective', url: 'https://www.facebook.com/groups/2027722134369108' },
            { name: 'Stay At Home Moms in Business', url: 'https://www.facebook.com/groups/601637519223787' },
            { name: 'Digital Marketing For Growth', url: 'https://www.facebook.com/groups/1586819345309789' },
            { name: 'Digital Marketing - ImpGrowth', url: 'https://www.facebook.com/groups/1146686613679308' }
        ]);
        
        console.log('Successfully seeded Facebook groups');
    } catch (error) {
        console.error('Error seeding Facebook groups:', error);
        process.exit(1);
    }
}

seed(); 