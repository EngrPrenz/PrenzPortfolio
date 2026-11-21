export interface CertificateDocument {
  id: string
  label: string
  issuerLabel: string
  fileUrl: string
  fileName: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  program?: string
  credentialType: string
  issueDate: string
  credentialId: string
  signatories: string[]
  summary: string
  competencies: string[]
  skills: string[]
  documents: CertificateDocument[]
}

export const certificationsData: Certification[] = [
  {
    id: 'cisco-prompt-like-an-engineer',
    title: 'Prompt Like an Engineer',
    issuer: 'Cisco Networking Academy',
    program: 'DICT-ITU DTC Initiative',
    credentialType: 'Student-Level Credential · Certificate of Course Completion',
    issueDate: 'Nov 08, 2026',
    credentialId: 'dcba8119-1143-46d8-8e92-eda33ecf83f0',
    signatories: [
      'Lynn Bloomer — Director, Cisco Networking Academy',
      'Laarni F. Tolentino — Instructor, DICT-ITU DTC Initiative',
    ],
    summary:
      'Completed hands-on engineering training on LLM orchestration, structured prompt design patterns, cloud vs. local model selection trade-offs, and rigorous output verification.',
    competencies: [
      'Explain how a chatbot is built around an LLM, including memory, system prompts, tools, and orchestration, and identify where errors can occur.',
      'Apply five guiding principles: stay in the lead, verify before trusting, weigh the effort, adapt AI to you, and manage risk.',
      'Decompose complex tasks and choose the right worker for each (yourself, coworkers, traditional software, cloud LLMs, or local LLMs).',
      'Select between cloud and local models based on privacy, performance, and hardware (RAM, processor, model size, and quantization).',
      'Build effective prompts iteratively using building blocks (instruction, context, input, and refinements).',
      'Apply prompt design patterns including few-shot prompting, chain of thought, prompt chaining, and the multi-expert panel.',
      'Get data into and out of a chatbot reliably, resolving tabular data and file encoding issues.',
      'Evaluate AI outputs for truth, executability, effectiveness, alignment, logic, and correctly cited sources.',
    ],
    skills: [
      'LLM Orchestration',
      'Prompt Engineering',
      'Few-Shot & CoT',
      'Prompt Chaining',
      'AI Output Verification',
      'Local vs. Cloud LLMs',
    ],
    documents: [
      {
        id: 'cisco-completion',
        label: 'Cisco Official Completion Certificate',
        issuerLabel: 'Cisco Networking Academy',
        fileUrl: '/certificates/cisco-prompt-like-an-engineer-completion.pdf',
        fileName: 'Cisco-Prompt-Like-an-Engineer-Completion.pdf',
      },
      {
        id: 'dict-itu-certificate',
        label: 'DICT-ITU DTC Initiative Certificate',
        issuerLabel: 'DICT-ITU DTC Initiative',
        fileUrl: '/certificates/dict-itu-prompt-like-an-engineer-certificate.pdf',
        fileName: 'DICT-ITU-Prompt-Like-an-Engineer-Certificate.pdf',
      },
    ],
  },
]
