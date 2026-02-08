export interface Leader {
    id: string;
    name: string;
    photo: string;
    title: string;
    role: string;
    experience: string;
    bio: string[];
    qualifications?: string[];
    achievements?: string[];
    specialties?: string[];
}

export const leaders: Leader[] = [
    {
        id: "1",
        name: "Hitakanshi Ghoshal",
        photo: "/dr-hitakanshi.jpeg",
        title: "Founder",
        role: "Founder & Mental Health Advocate",
        experience: "15 years",
        bio: [
            "I am Hitakanshi Ghoshal, the founder of Innoma Healthcare. I am a mental health survivor, and the experiences of my life have given me rare and deeply personal insights into how mental illness develops and how true healing becomes possible.",
            "For many years, my struggles were understood only through diagnoses and symptoms. It wasn't until I began exploring my past experiences through a trauma-informed lens that everything changed. I discovered that what I had once believed to be a lifelong illness was, in many ways, my mind's way of protecting me, adapting to early experiences that were too overwhelming to comprehend at the time.",
            "This shift in understanding transformed not just my healing, but my entire perspective on mental healthcare. I came to see mental illness not as something broken or irreversible, but as a meaningful response to unaddressed trauma, stress, and survival. When the root causes are understood with compassion and care, real recovery becomes possible.",
            "Innoma Healthcare was born from this realization. It is my attempt to reimagine mental health care as something that is humane, trauma-informed, and deeply respectful of each individual's story. Through Innoma, my mission is to help people move beyond symptom management towards clarity, safety, and long lasting healing."
        ],
        specialties: [
            "Trauma-Informed Care",
            "Mental Health Recovery",
            "Patient Advocacy",
            "Healthcare Innovation"
        ]
    },
    {
        id: "2",
        name: "Dr. Eepsita Mishra",
        photo: "/dr-epista.jpeg",
        title: "Psychiatrist",
        role: "MBBS, MD, DNB, Assoc. MNAMS",
        experience: "10 years",
        bio: [
            "Hi, I'm Dr. Eepsita Mishra (MBBS, MD, DNB, Assoc. MNAMS), a psychiatrist committed to helping individuals achieve mental wellness through compassionate, evidence-based care.",
            "I specialize in the diagnosis and treatment of a wide range of mental health conditions, including anxiety disorders, depression, bipolar disorder, OCD, psychotic disorders, addiction, and sexual dysfunction. I completed my MBBS from GSVM Medical College, Kanpur, followed by an MD in Psychiatry from PGIMER, Chandigarh, where I received extensive training in psychopharmacology, psychotherapy, and integrative psychiatric care. I am a double medallist and hold dual postgraduate qualifications, including a DNB in Psychiatry.",
            "I have worked at PGIMER, Chandigarh (2023–2025), gaining comprehensive experience across outpatient and inpatient care, emergency psychiatry, psychotherapy (CBT, DBT, behavioural, supportive, and marital therapy), neuromodulation techniques (ECT, rTMS, tDCS), child and adolescent psychiatry, geriatric psychiatry, de-addiction services, and consultation-liaison psychiatry. I also served as a frontline COVID-19 healthcare worker and provided extensive telepsychiatry support during and after the pandemic.",
            "Beyond clinical practice, I am deeply invested in mental health advocacy, education, and research. I have published 11 research papers, contributed 4 chapters in a book, and gave presentations at 9 national conferences. My doctoral research focused on the assessment of depression in patients with cancer. I have also led training programs for primary healthcare providers and conducted mental wellness workshops for defence personnel, work that was highly recognised by the Ministry of Defence.",
            "I am a member of the Indian Psychiatric Society and an Associate Member of the National Academy of Medical Sciences. My approach to care is patient-centred, non-judgmental, and collaborative, combining thoughtful medication management with supportive psychotherapy to create a safe space for healing and long-term well-being."
        ],
        qualifications: [
            "MBBS - GSVM Medical College, Kanpur",
            "MD in Psychiatry - PGIMER, Chandigarh",
            "DNB in Psychiatry",
            "Associate Member - National Academy of Medical Sciences"
        ],
        achievements: [
            "Double Medallist in Psychiatry",
            "Published 11 research papers",
            "Contributed 4 book chapters",
            "Presented at 9 national conferences",
            "Frontline COVID-19 healthcare worker",
            "Recognized by Ministry of Defence for mental wellness workshops"
        ],
        specialties: [
            "Anxiety Disorders",
            "Depression",
            "Bipolar Disorder",
            "OCD",
            "Psychotic Disorders",
            "Addiction",
            "Sexual Dysfunction",
            "Child & Adolescent Psychiatry",
            "Geriatric Psychiatry",
            "Psychotherapy (CBT, DBT)"
        ]
    },
    {
        id: "3",
        name: "Dr. Sidharth Chattopadhyaya",
        photo: "/dr-Siddharth .jpeg",
        title: "Clinical Psychologist",
        role: "Clinical Psychologist & Researcher",
        experience: "12 years",
        bio: [
            "Dr. Sidharth Chattopadhyaya is a distinguished clinical psychologist with over 12 years of experience in mental health care. His expertise lies in understanding the complex interplay between anxiety, depression, and trauma, helping individuals navigate their mental health journey with evidence-based therapeutic approaches.",
            "Throughout his career, Dr. Chattopadhyaya has worked extensively with individuals facing various mental health challenges, from acute anxiety and depression to complex trauma-related disorders. His approach combines traditional therapeutic methods with innovative, research-backed techniques to provide comprehensive care tailored to each individual's unique needs.",
            "Dr. Chattopadhyaya is passionate about making mental health care accessible and effective. He believes in creating a safe, non-judgmental space where individuals can explore their thoughts, emotions, and experiences. His therapeutic style is collaborative, empowering clients to develop the tools and insights needed for lasting change.",
            "Beyond his clinical work, Dr. Chattopadhyaya is actively involved in mental health research and education. He regularly conducts workshops and training sessions for mental health professionals and contributes to advancing the field through his research on anxiety disorders and depression treatment modalities."
        ],
        qualifications: [
            "PhD in Clinical Psychology",
            "M.Phil in Clinical Psychology",
            "MA in Psychology"
        ],
        specialties: [
            "Anxiety Disorders",
            "Depression",
            "Trauma & PTSD",
            "Cognitive Behavioral Therapy",
            "Mindfulness-Based Interventions",
            "Stress Management"
        ]
    }
];

export const getLeaderById = (id: string): Leader | undefined => {
    return leaders.find(leader => leader.id === id);
};
