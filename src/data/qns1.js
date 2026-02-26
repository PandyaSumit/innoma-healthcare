
  const qus = [
    {
      title: "Do I need therapy?",
      subtitle:
        "Think about how you've been feeling over the past 2 weeks. For each question, choose the answer that fits best:",
      questions: [
        {
          text: "Mood: Have you often felt sad, down, worried, or easily upset?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Vitals: Have you felt tired, had sleep or appetite changes, or unexplained body aches?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Cognition: Have you had trouble focusing, making decisions, or had any upsetting thoughts?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Routine Tasks: Have you had a hard time getting through your daily tasks or responsibilities?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Self Image: Have you felt bad about yourself, overwhelmed, or like you're not good enough?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Relationships: Have you felt distant from others, had conflicts, or avoided spending time with people close to you?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Trauma: Do you have unwanted thoughts or memories that suddenly pop into your head?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Do you have disturbing nightmares?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Do you feel emotionally numb or dissociated?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
        {
          text: "Do you stay on guard or get startled easily?",
          type: "radio",
          options: [
            "0 – Not at all",
            "1 – A few days",
            "2 – Most days",
            "3 – Every day",
          ],
        },
      ],
    },
    {
      title: "Do I have Trauma?",
      subtitle: "Have you experienced the following?",
      questions: [
        {
          text: "Unwanted upsetting memories about a distressing event",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Nightmares or disturbed sleep related to a past experience",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Flashbacks or feeling like the event is happening again",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Feeling emotionally numb or disconnected from others",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Feeling jumpy, on edge, or easily startled",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Trouble concentrating or feeling confused",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Physical pain with no clear cause",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Intense feelings of shame, guilt, or self-blame without any immediate trigger",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Difficulty feeling safe, even in familiar environments",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Tried to cope through alcohol, drugs, or risky behaviors?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Felt emotionally overwhelmed and unsure why?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Experience intrusive thoughts or mental images you can't control?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Find yourself engaging in risky or self-destructive behavior?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Notice a rapid heart rate, shortness of breath, or sweating without physical exertion?",
          type: "radio",
          options: ["Yes", "No"],
        },
      ],
    },
    {
      title: "Do I have sexual trauma?",
      subtitle: "",
      questions: [
        {
          text: "Body Discomfort: Do you feel disconnected from or uncomfortable in your body, especially regarding touch or intimacy?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Emotional Numbness: Do you often feel emotionally detached or find it difficult to connect with others?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Anxiety or Panic: Do you experience sudden episodes of anxiety, panic, or intense fear that seem unrelated to your current situation?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Sexual Difficulties: Do you struggle with fear, discomfort, or guilt during sexual activity or avoid it altogether?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Low Self-Worth or Shame: Do you often feel ashamed of yourself, dirty, or unworthy — even if you can't explain why?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Memory Gaps or Confusion: Do you have trouble recalling parts of your childhood or feel unsure about certain past events?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Hypervigilance: Are you frequently on edge or overly alert to your surroundings, as if something bad might happen?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Self-Harm or Risky Behavior: Have you engaged in self-harm, substance use, or other risky behaviors to cope with overwhelming emotions?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Bodily Pain: Do you experience frequent pain in your legs, pelvic region, or genitals?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Body Detachment: Do you sometimes feel like you are outside your body or disconnected from it, especially during stress or physical touch?",
          type: "radio",
          options: ["Yes", "No"],
        },
      ],
    },
    {
      title: "Do I have Emotional Trauma?",
      subtitle: "",
      questions: [
        {
          text: "Fear of Conflict: Do you feel anxious or panicked at the idea of upsetting someone, even in minor disagreements?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Walking on Eggshells: Do you often monitor or censor yourself around others to avoid triggering criticism, anger, or rejection?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Self-Blame: Do you frequently blame yourself for things going wrong, even when you know it isn't your fault?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Difficulty Trusting Others: Do you find it hard to open up, be vulnerable, or believe that people genuinely care about you?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Shame and Low Self-Worth: Do you struggle with persistent feelings of shame, unworthiness, or the belief that you are 'not good enough'?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Emotional Numbness or Disconnection: Do you sometimes feel detached from your emotions or unable to fully feel joy, love, or anger?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Internalized Criticism: Do you have a harsh inner voice that echoes past insults, judgments, or put-downs from someone else?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Inability to Trust Your Feelings: Do you second-guess your emotions or instincts, wondering if you're 'too sensitive' or 'overreacting'?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Fear of Being a Burden: Do you avoid asking for help or emotional support because you don't want to be seen as needy or difficult?",
          type: "radio",
          options: ["Yes", "No"],
        },
        {
          text: "Minimizing Your Needs: Do you believe your needs, feelings, or boundaries are less important than others?",
          type: "radio",
          options: ["Yes", "No"],
        },
      ],
    },
    {
      title: "Do I have Hidden Trauma?",
      subtitle: "Answer each with Yes / Sometimes / No.",
      questions: [
        {
          text: "Memory & Awareness: Do you have gaps in childhood or adult memories that feel unusual or unexplainable?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Do you sometimes feel emotionally numb or disconnected from your experiences?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Do you struggle to recall details of upsetting events, even when you know they happened?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Body-Based Signals: Do you feel strong physical reactions (tight chest, stomach drops, shaking) without a clear trigger?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Do you often 'zone out,' daydream, or lose track of time more than others?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Certain places, sounds, or people make your body react before your mind understands why?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Emotional Patterns: Do you have sudden emotional shifts (fear, anger, shame) that seem disproportionate to the situation?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Do you avoid certain topics, feelings, or people without knowing exactly why?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Behaviour & Relationships: Do you feel like a different version of yourself in different situations, more than seems normal?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
        {
          text: "Do you find yourself overly accommodating, hyper-independent, or hyper-alert around others?",
          type: "radio",
          options: ["Yes", "Sometimes", "No"],
        },
      ],
    },
  ];