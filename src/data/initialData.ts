import {
  ClassLevel,
  Subject,
  Course,
  Unit,
  Lecture,
  EducationalResource,
  Quiz,
  Badge,
  Announcement,
  StudentProfile,
  LectureProgress,
  QuizAttempt,
  BookmarkItem,
  CbseSamplePaper,
  StudentSuggestionMessage,
} from '../types';

export const INITIAL_CLASSES: ClassLevel[] = [
  { id: 'class-6', name: 'Class 6', numericLevel: 6, isActive: true },
  { id: 'class-7', name: 'Class 7', numericLevel: 7, isActive: true },
  { id: 'class-8', name: 'Class 8', numericLevel: 8, isActive: true },
  { id: 'class-9', name: 'Class 9', numericLevel: 9, isActive: true },
  { id: 'class-10', name: 'Class 10', numericLevel: 10, isActive: true },
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-ai-10',
    classId: 'class-10',
    code: '417',
    name: 'Artificial Intelligence',
    icon: 'BrainCircuit',
    description: 'CBSE Skill Education Course on Artificial Intelligence, Machine Learning, Computer Vision, NLP & Advanced Python.',
  },
  {
    id: 'sub-it-10',
    classId: 'class-10',
    code: '402',
    name: 'Information Technology',
    icon: 'Laptop',
    description: 'Digital Documentation, Electronic Spreadsheet, and Database Management Systems.',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-ai-10',
    subjectId: 'sub-ai-10',
    title: 'Class 10 Artificial Intelligence (Code 417)',
    classNumber: '10',
    academicYear: '2026-2027',
    description: 'CBSE Curriculum covering the 7 core units: AI Project Cycle & Ethics, Modeling, Model Evaluation, Statistical Data, Computer Vision, Natural Language Processing, and Advanced Python.',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
  },
];

// EXACT 7 UNITS specified by user
export const INITIAL_UNITS: Unit[] = [
  {
    id: 'unit-1',
    courseId: 'course-ai-10',
    unitNumber: 1,
    title: 'Revisiting AI Project Cycle & Ethical Frameworks for AI',
    description: 'Understand the 5 stages of the AI Project Cycle (Problem Scoping, Data Acquisition, Data Exploration, Modelling, Evaluation) with 4Ws canvas and explore core ethical frameworks: bias, fairness, accountability, privacy, and safety.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    displayOrder: 1,
    isPublished: true,
    estimatedHours: 6,
  },
  {
    id: 'unit-2',
    courseId: 'course-ai-10',
    unitNumber: 2,
    title: 'Advanced Concepts of Modeling in AI',
    description: 'Explore rule-based vs learning-based modeling paradigms, supervised learning (classification vs regression), unsupervised learning (clustering vs association), and reinforcement learning fundamentals.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    displayOrder: 2,
    isPublished: true,
    estimatedHours: 8,
  },
  {
    id: 'unit-3',
    courseId: 'course-ai-10',
    unitNumber: 3,
    title: 'Evaluating Models',
    description: 'Master AI model evaluation metrics: Confusion Matrix (TP, TN, FP, FN), Precision, Recall, Accuracy, and F1 Score with step-by-step board numerical problem solving and real-world scenario analysis.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    displayOrder: 3,
    isPublished: true,
    estimatedHours: 8,
  },
  {
    id: 'unit-4',
    courseId: 'course-ai-10',
    unitNumber: 4,
    title: 'Statistical Data',
    description: 'Learn the statistical backbone of Artificial Intelligence: understanding datasets, measures of central tendency (Mean, Median, Mode), measures of dispersion (Variance, Standard Deviation), outliers, and data normalization.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    displayOrder: 4,
    isPublished: true,
    estimatedHours: 7,
  },
  {
    id: 'unit-5',
    courseId: 'course-ai-10',
    unitNumber: 5,
    title: 'Computer Vision',
    description: 'Delve into how machines process and perceive images: pixels, resolution, RGB color matrices, grayscale conversion, convolution filters, edge detection, object recognition, and real-world vision applications.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    displayOrder: 5,
    isPublished: true,
    estimatedHours: 9,
  },
  {
    id: 'unit-6',
    courseId: 'course-ai-10',
    unitNumber: 6,
    title: 'Natural Language Processing',
    description: 'Demystify human language processing by machines: NLP pipeline, text normalization (tokenization, stop words, stemming, lemmatization), Bag of Words (BoW), Document Term Matrix (DTM), and TF-IDF numerical calculations.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    displayOrder: 6,
    isPublished: true,
    estimatedHours: 9,
  },
  {
    id: 'unit-7',
    courseId: 'course-ai-10',
    unitNumber: 7,
    title: 'Advance Python',
    description: 'Hands-on programming mastery for AI: complex lists, tuples, dictionaries, NumPy array manipulation, Pandas DataFrames for dataset exploration, and Matplotlib data visualization for machine learning insights.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
    displayOrder: 7,
    isPublished: true,
    estimatedHours: 10,
  },
];

// LECTURES FOR ALL 7 UNITS — Currently empty. Admin will upload videos from Admin Portal.
export const INITIAL_LECTURES: Lecture[] = [];

// EDUCATIONAL RESOURCES & PDF NOTES FOR ALL 7 UNITS
export const INITIAL_RESOURCES: EducationalResource[] = [
  // Unit 1
  {
    id: 'res-1-1',
    unitId: 'unit-1',
    lectureId: 'lec-1-1',
    title: 'Complete Revision Notes: AI Project Cycle & Ethical Frameworks',
    description: 'High-yield revision notes covering Problem Scoping (4Ws), Data Acquisition, Data Exploration, Modeling, Evaluation, and CBSE AI Ethics Guidelines.',
    resourceType: 'PDF',
    fileSize: '2.4 MB',
    pageCount: 8,
    downloadUrl: '#download-notes-unit-1',
    textContentMarkdown: `# Class 10 Artificial Intelligence (Subject Code 417)
## Unit 1: Revisiting AI Project Cycle & Ethical Frameworks for AI

### 1. The 5 Stages of the AI Project Cycle
1. **Problem Scoping**: Identifying the issue, finding stakeholders, and defining the 4Ws.
2. **Data Acquisition**: Collecting authentic data from reliable sources, APIs, and sensors.
3. **Data Exploration**: Cleaning, normalizing, visualizing patterns, and dealing with missing data.
4. **Modelling**: Selecting rule-based or learning-based algorithms (Supervised / Unsupervised).
5. **Evaluation**: Assessing the model using the Confusion Matrix, Precision, Recall, Accuracy, and F1 Score.

---

### 2. The 4Ws Problem Scoping Canvas
- **Who**: Identifies the stakeholders who face the problem and will benefit from the solution.
- **What**: Specifies what the problem actually is and the nature of the challenge.
- **Where**: Details the context, environment, or location where the problem occurs.
- **Why**: Explains why solving this problem matters and what measurable value it will bring.

---

### 3. Ethical Frameworks for AI
- **AI Bias**: Algorithms can amplify human biases present in the training datasets.
- **Fairness & Inclusivity**: Systems must work equally well across gender, race, and socio-economic demographics.
- **Data Privacy**: Users must have informed consent and right over personal identifiable information (PII).
- **Accountability**: Developers and organizations remain liable for the outcomes of automated decisions.`,
    displayOrder: 1,
    isPublished: true,
    uploadedAt: '2026-08-10T12:00:00Z',
  },

  // Unit 2
  {
    id: 'res-2-1',
    unitId: 'unit-2',
    lectureId: 'lec-2-1',
    title: 'Detailed Guide: AI Modeling Paradigms & Algorithm Cheat Sheet',
    description: 'Comprehensive comparison between Rule-Based vs Learning-Based models, Supervised (Classification/Regression) and Unsupervised (Clustering/Association).',
    resourceType: 'PDF',
    fileSize: '3.1 MB',
    pageCount: 10,
    downloadUrl: '#download-notes-unit-2',
    textContentMarkdown: `# Class 10 Artificial Intelligence (Subject Code 417)
## Unit 2: Advanced Concepts of Modeling in AI

### 1. Rule-Based vs Learning-Based Approach
- **Rule-Based**: Developer writes explicit logic (*If-Else* statements). Fails when unexpected edge cases occur.
- **Learning-Based**: Machine identifies patterns in training data to infer rules automatically.

---

### 2. Supervised Learning
- Requires **labeled data** (inputs paired with verified outputs).
- **Classification**: Target is discrete categorical (e.g. Pass/Fail, Tumor/Benign, Cat/Dog).
- **Regression**: Target is continuous numeric (e.g. Temperature, Stock price, Exam marks).

---

### 3. Unsupervised Learning
- Operates on **unlabeled data**. Discovers natural groupings or associations.
- **Clustering**: Groups data by Euclidean distance (e.g. K-Means customer segmentation).
- **Association**: Identifies relationships between co-occurring events (e.g. Market basket analysis).`,
    displayOrder: 1,
    isPublished: true,
    uploadedAt: '2026-08-22T12:00:00Z',
  },

  // Unit 3
  {
    id: 'res-3-1',
    unitId: 'unit-3',
    lectureId: 'lec-3-2',
    title: 'Formula Handbook: Evaluating Models & 10 Solved Board Numericals',
    description: 'Step-by-step mathematical guide to Confusion Matrix, Precision, Recall, Accuracy, and F1 Score with 10 worked board numericals.',
    resourceType: 'PDF',
    fileSize: '2.8 MB',
    pageCount: 12,
    downloadUrl: '#download-notes-unit-3',
    textContentMarkdown: `# Class 10 Artificial Intelligence (Subject Code 417)
## Unit 3: Evaluating Models — Formulas & Solved Numericals

### 1. The Confusion Matrix
| | Reality: True | Reality: False |
|---|---|---|
| **Predicted: True** | True Positive (TP) | False Positive (FP) |
| **Predicted: False** | False Negative (FN) | True Negative (TN) |

---

### 2. Evaluation Formulas
1. **Accuracy**:
   $$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$$

2. **Precision**:
   $$\\text{Precision} = \\frac{TP}{TP + FP}$$

3. **Recall (Sensitivity)**:
   $$\\text{Recall} = \\frac{TP}{TP + FN}$$

4. **F1 Score**:
   $$\\text{F1 Score} = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$

---

### 3. Solved Board Numerical Example
**Question**: An AI model for predicting wildfire risk yields:
- TP = 40, TN = 50, FP = 10, FN = 0
Calculate Accuracy, Precision, Recall, and F1 Score.

**Solution**:
- Total Cases = 40 + 50 + 10 + 0 = 100
- **Accuracy** = (40 + 50) / 100 = 90%
- **Precision** = 40 / (40 + 10) = 40 / 50 = 80% (0.80)
- **Recall** = 40 / (40 + 0) = 100% (1.00)
- **F1 Score** = 2 * (0.8 * 1.0) / (0.8 + 1.0) = 1.6 / 1.8 = 0.888 (88.8%)`,
    displayOrder: 1,
    isPublished: true,
    uploadedAt: '2026-09-08T12:00:00Z',
  },

  // Unit 4
  {
    id: 'res-4-1',
    unitId: 'unit-4',
    lectureId: 'lec-4-2',
    title: 'CBSE Handbook: Statistical Foundations for AI Models',
    description: 'Comprehensive study material on Mean, Median, Mode, Standard Deviation, Outliers, Min-Max Normalization, and Feature Scaling.',
    resourceType: 'PDF',
    fileSize: '2.5 MB',
    pageCount: 9,
    downloadUrl: '#download-notes-unit-4',
    textContentMarkdown: `# Class 10 Artificial Intelligence (Subject Code 417)
## Unit 4: Statistical Data

### 1. Central Tendency in AI Datasets
- **Mean**: The mathematical average. Sensitive to outliers.
- **Median**: The middle value of sorted data. Robust against extreme skewed values.
- **Mode**: The most frequent item in categorical columns.

---

### 2. Measures of Dispersion
- **Range**: Maximum value minus Minimum value.
- **Variance**: Average squared difference from the mean.
- **Standard Deviation ($\\sigma$)**: Square root of variance; indicates spread around mean.

---

### 3. Min-Max Normalization Formula
$$X_{\\text{norm}} = \\frac{X - X_{\\min}}{X_{\\max} - X_{\\min}}$$
Rescales all feature columns into a standard [0, 1] range so no single feature dominates the learning gradient.`,
    displayOrder: 1,
    isPublished: true,
    uploadedAt: '2026-09-18T12:00:00Z',
  },

  // Unit 5
  {
    id: 'res-5-1',
    unitId: 'unit-5',
    lectureId: 'lec-5-1',
    title: 'Visual Guide to Computer Vision & Image Processing',
    description: 'Pixel structures, RGB color channel matrices, convolution kernel arithmetic, edge filters, and real-world vision applications.',
    resourceType: 'PDF',
    fileSize: '3.6 MB',
    pageCount: 11,
    downloadUrl: '#download-notes-unit-5',
    textContentMarkdown: `# Class 10 Artificial Intelligence (Subject Code 417)
## Unit 5: Computer Vision

### 1. How Machines Store Images
- A digital image is a 2D matrix of numbers representing pixel intensity.
- **Grayscale**: 1 channel, values from 0 (Black) to 255 (White).
- **RGB**: 3 color channels (Red, Green, Blue). An image of 100x100 resolution contains $100 \\times 100 \\times 3 = 30,000$ values.

---

### 2. Convolution & Feature Extraction
- A **Kernel** (e.g. 3x3 filter) slides over input pixels and multiplies corresponding elements to produce a feature map.
- Used for blurring, sharpening, and detecting vertical/horizontal edges.

---

### 3. Core Tasks in Computer Vision
1. **Classification**: "There is a car in this image."
2. **Object Detection**: "There is a car at coordinates (x:45, y:80, w:120, h:70)."
3. **Semantic Segmentation**: Identifying exact pixel boundaries for medical scans and road lanes.`,
    displayOrder: 1,
    isPublished: true,
    uploadedAt: '2026-09-25T12:00:00Z',
  },

  // Unit 6
  {
    id: 'res-6-1',
    unitId: 'unit-6',
    lectureId: 'lec-6-4',
    title: 'Complete NLP Master Revision Notes with TF-IDF Worked Examples',
    description: 'NLP pipeline, Tokenization, Stop words, Stemming vs Lemmatization, Bag of Words, DTM, and worked TF-IDF board problems.',
    resourceType: 'PDF',
    fileSize: '2.9 MB',
    pageCount: 10,
    downloadUrl: '#download-notes-unit-6',
    textContentMarkdown: `# Class 10 Artificial Intelligence (Subject Code 417)
## Unit 6: Natural Language Processing (NLP)

### 1. Text Normalization Pipeline
1. **Sentence Segmentation**: Splitting long paragraphs into individual sentences.
2. **Tokenization**: Breaking sentences into smaller units called tokens (words/punctuation).
3. **Removing Stop Words**: Removing uninformative common words like *is, the, at, on*.
4. **Stemming**: Chopping word endings with heuristic rules (e.g. *studying* -> *studi*).
5. **Lemmatization**: Converting words to true dictionary root forms using morphological analysis (e.g. *crying* -> *cry*).

---

### 2. Bag of Words (BoW) & DTM
- Creates a comprehensive vocabulary of all unique tokens across documents.
- Creates a matrix where rows are documents and columns are word counts.

---

### 3. TF-IDF Formula
- **Term Frequency (TF)**:
  $$\\text{TF}(t, d) = \\frac{\\text{Count of } t \\text{ in document } d}{\\text{Total words in document } d}$$
- **Inverse Document Frequency (IDF)**:
  $$\\text{IDF}(t) = \\log_{10}\\left(\\frac{\\text{Total Documents}}{\\text{Documents containing } t}\\right)$$
- **TF-IDF**:
  $$\\text{TF-IDF} = \\text{TF} \\times \\text{IDF}$$`,
    displayOrder: 1,
    isPublished: true,
    uploadedAt: '2026-10-05T12:00:00Z',
  },

  // Unit 7
  {
    id: 'res-7-1',
    unitId: 'unit-7',
    lectureId: 'lec-7-2',
    title: 'Advanced Python for AI: Code Cookbook & Cheat Sheet (NumPy & Pandas)',
    description: 'Hands-on code snippets for NumPy arrays, Pandas DataFrames, handling missing values, and Matplotlib data plots.',
    resourceType: 'PDF',
    fileSize: '3.4 MB',
    pageCount: 12,
    downloadUrl: '#download-notes-unit-7',
    textContentMarkdown: `# Class 10 Artificial Intelligence (Subject Code 417)
## Unit 7: Advance Python for AI & Data Science

### 1. NumPy Essentials
\`\`\`python
import numpy as np

# Creating 1D and 2D arrays
arr1 = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2], [3, 4]])

# Fast vector math
result = arr1 * 2  # [2, 4, 6, 8, 10]
dot_product = np.dot(matrix, np.array([10, 20]))
\`\`\`

---

### 2. Pandas DataFrames
\`\`\`python
import pandas as pd

# Load dataset
df = pd.read_csv("ai_students.csv")

# Quick overview
print(df.head())
print(df.describe())

# Cleaning missing data
df_clean = df.fillna(df.mean(numeric_only=True))
\`\`\`

---

### 3. Matplotlib Visualizations
\`\`\`python
import matplotlib.pyplot as plt

plt.scatter(df["Hours_Studied"], df["AI_Score"], color="indigo")
plt.title("Study Hours vs AI Exam Score")
plt.xlabel("Hours Studied")
plt.ylabel("Score (%)")
plt.grid(True)
plt.show()
\`\`\``,
    displayOrder: 1,
    isPublished: true,
    uploadedAt: '2026-10-18T12:00:00Z',
  },
];

// CBSE SAMPLE PAPERS (EMPTY INITIAL STATE - MANAGED VIA ADMIN PORTAL)
export const INITIAL_CBSE_SAMPLE_PAPERS: CbseSamplePaper[] = [];

// QUIZZES FOR ALL 7 UNITS
export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-unit-1',
    unitId: 'unit-1',
    title: 'Unit 1 Assessment: Ethics & AI Project Cycle',
    description: 'Test your understanding of Problem Scoping, 4Ws Canvas, and AI Ethical Frameworks.',
    timeLimitMinutes: 10,
    isPublished: true,
    questions: [
      {
        id: 'q-1-1',
        question: 'Which of the following is NOT one of the 4Ws in the Problem Scoping Canvas?',
        optionA: 'Who',
        optionB: 'What',
        optionC: 'When',
        optionD: 'Why',
        correctAnswer: 'C',
        explanation: 'The 4Ws Problem Scoping Canvas consists of Who, What, Where, and Why.',
      },
      {
        id: 'q-1-2',
        question: 'When an AI recruitment tool unfairly favors male applicants due to historical resume patterns, it is an example of:',
        optionA: 'Hardware failure',
        optionB: 'Algorithmic bias',
        optionC: 'Unsupervised clustering',
        optionD: 'Data encryption',
        correctAnswer: 'B',
        explanation: 'Algorithmic bias happens when historical human prejudices are captured in training datasets and amplified by the model.',
      },
      {
        id: 'q-1-3',
        question: 'Which stage of the AI Project Cycle directly precedes the Evaluation stage?',
        optionA: 'Problem Scoping',
        optionB: 'Data Acquisition',
        optionC: 'Modelling',
        optionD: 'Data Exploration',
        correctAnswer: 'C',
        explanation: 'The sequence is Scoping -> Acquisition -> Exploration -> Modelling -> Evaluation.',
      },
    ],
  },
  {
    id: 'quiz-unit-2',
    unitId: 'unit-2',
    title: 'Unit 2 Assessment: Advanced Modeling Concepts',
    description: 'Test your knowledge on Rule-Based vs Learning-Based, Supervised, and Unsupervised algorithms.',
    timeLimitMinutes: 10,
    isPublished: true,
    questions: [
      {
        id: 'q-2-1',
        question: 'Predicting the exact sale price of a house based on area and bedrooms is which type of task?',
        optionA: 'Classification',
        optionB: 'Regression',
        optionC: 'Clustering',
        optionD: 'Association',
        correctAnswer: 'B',
        explanation: 'Regression predicts continuous numerical values such as price, temperature, or age.',
      },
      {
        id: 'q-2-2',
        question: 'Which learning paradigm groups customer purchase patterns without any prior labeled targets?',
        optionA: 'Supervised Learning',
        optionB: 'Rule-Based Heuristics',
        optionC: 'Unsupervised Learning',
        optionD: 'Deterministic Logic',
        correctAnswer: 'C',
        explanation: 'Unsupervised learning operates on unlabeled data to find inherent groupings and clusters.',
      },
    ],
  },
  {
    id: 'quiz-unit-3',
    unitId: 'unit-3',
    title: 'Unit 3 Assessment: Evaluating Models & Metrics',
    description: 'CBSE numerical questions on Confusion Matrix, Precision, Recall, and F1 Score.',
    timeLimitMinutes: 15,
    isPublished: true,
    questions: [
      {
        id: 'q-3-1',
        question: 'In a medical cancer detection test, if a patient HAS cancer but the model says NO CANCER, this is a:',
        optionA: 'True Positive (TP)',
        optionB: 'True Negative (TN)',
        optionC: 'False Positive (FP)',
        optionD: 'False Negative (FN)',
        correctAnswer: 'D',
        explanation: 'Reality is True (Cancer present) but Model predicted False (No cancer) = False Negative (Type II error).',
      },
      {
        id: 'q-3-2',
        question: 'If TP = 30 and FP = 10, what is the Precision of the model?',
        optionA: '30%',
        optionB: '75%',
        optionC: '33.3%',
        optionD: '80%',
        correctAnswer: 'B',
        explanation: 'Precision = TP / (TP + FP) = 30 / (30 + 10) = 30 / 40 = 0.75 or 75%.',
      },
      {
        id: 'q-3-3',
        question: 'Why is F1 Score preferred over simple Accuracy in imbalanced datasets?',
        optionA: 'It uses arithmetic average',
        optionB: 'It calculates harmonic mean of Precision and Recall',
        optionC: 'It only counts True Negatives',
        optionD: 'It ignores False Positives',
        correctAnswer: 'B',
        explanation: 'The F1 Score is the harmonic mean of Precision and Recall, penalizing extreme values.',
      },
    ],
  },
  {
    id: 'quiz-unit-4',
    unitId: 'unit-4',
    title: 'Unit 4 Assessment: Statistical Data for AI',
    description: 'Check your knowledge on Mean, Median, Mode, Variance, and Data Normalization.',
    timeLimitMinutes: 10,
    isPublished: true,
    questions: [
      {
        id: 'q-4-1',
        question: 'Which measure of central tendency is least affected by extreme outliers in a dataset?',
        optionA: 'Mean',
        optionB: 'Median',
        optionC: 'Standard Deviation',
        optionD: 'Range',
        correctAnswer: 'B',
        explanation: 'The Median represents the middle value and remains robust against isolated extreme outliers.',
      },
      {
        id: 'q-4-2',
        question: 'What is the value range produced by Min-Max normalization?',
        optionA: '-1 to +1',
        optionB: '0 to 1',
        optionC: '0 to 255',
        optionD: '1 to 100',
        correctAnswer: 'B',
        explanation: 'Min-Max normalization rescales all values to fit between 0 and 1.',
      },
    ],
  },
  {
    id: 'quiz-unit-5',
    unitId: 'unit-5',
    title: 'Unit 5 Assessment: Computer Vision',
    description: 'Questions on pixels, RGB channels, convolution filters, and vision tasks.',
    timeLimitMinutes: 10,
    isPublished: true,
    questions: [
      {
        id: 'q-5-1',
        question: 'What does a pixel value of 0 represent in an 8-bit grayscale image?',
        optionA: 'Pure White',
        optionB: 'Pure Black',
        optionC: 'Pure Gray',
        optionD: 'Transparent',
        correctAnswer: 'B',
        explanation: 'In 8-bit images, 0 is Black and 255 is White.',
      },
      {
        id: 'q-5-2',
        question: 'Which computer vision task draws bounding boxes around objects and identifies their categories?',
        optionA: 'Image Classification',
        optionB: 'Object Detection',
        optionC: 'Grayscale Filtering',
        optionD: 'Tokenization',
        correctAnswer: 'B',
        explanation: 'Object Detection localizes objects using bounding boxes while classifying them.',
      },
    ],
  },
  {
    id: 'quiz-unit-6',
    unitId: 'unit-6',
    title: 'Unit 6 Assessment: Natural Language Processing',
    description: 'Questions on Tokenization, Stop words, Stemming, and TF-IDF calculation.',
    timeLimitMinutes: 12,
    isPublished: true,
    questions: [
      {
        id: 'q-6-1',
        question: 'Which technique converts the word "better" into its dictionary root "good"?',
        optionA: 'Stemming',
        optionB: 'Lemmatization',
        optionC: 'Tokenization',
        optionD: 'Stopword removal',
        correctAnswer: 'B',
        explanation: 'Lemmatization uses dictionary morphological lookups to find true base words (better -> good).',
      },
      {
        id: 'q-6-2',
        question: 'In TF-IDF, if a word appears in EVERY document in a corpus, its IDF value will be:',
        optionA: 'Very high',
        optionB: 'Zero or near zero',
        optionC: 'Negative infinity',
        optionD: 'Always 1',
        correctAnswer: 'B',
        explanation: 'IDF = log(N / N) = log(1) = 0. Common words receive zero weight.',
      },
    ],
  },
  {
    id: 'quiz-unit-7',
    unitId: 'unit-7',
    title: 'Unit 7 Assessment: Advance Python for AI',
    description: 'Assess Python skills in NumPy arrays, Pandas DataFrames, and Matplotlib.',
    timeLimitMinutes: 10,
    isPublished: true,
    questions: [
      {
        id: 'q-7-1',
        question: 'Which NumPy method creates an array filled with 5 zeros?',
        optionA: 'np.empty(5)',
        optionB: 'np.zeros(5)',
        optionC: 'np.null(5)',
        optionD: 'np.array(0, 5)',
        correctAnswer: 'B',
        explanation: 'np.zeros(5) produces an array [0., 0., 0., 0., 0.].',
      },
      {
        id: 'q-7-2',
        question: 'Which Pandas method fills missing NaN values with a specified number or mean?',
        optionA: 'df.dropna()',
        optionB: 'df.fillna()',
        optionC: 'df.replace_null()',
        optionD: 'df.clean()',
        correctAnswer: 'B',
        explanation: 'df.fillna() replaces null or NaN entries with a chosen value.',
      },
    ],
  },
];

// INITIAL BADGES
export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-starter',
    code: 'AI_STARTER',
    title: '🌱 AI Starter',
    description: 'Enrolled in Class 10 AI and commenced Unit 1 learning.',
    icon: '🌱',
    level: 'STARTER',
    criteria: 'Register profile and watch 1st lecture.',
  },
  {
    id: 'badge-explorer',
    code: 'AI_EXPLORER',
    title: '🧠 AI Explorer',
    description: 'Completed 25% of the curriculum across Computer Vision & NLP.',
    icon: '🧠',
    level: 'EXPLORER',
    criteria: 'Reach 25% overall course progress.',
  },
  {
    id: 'badge-builder',
    code: 'MODEL_BUILDER',
    title: '🔬 Model Builder',
    description: 'Mastered the AI Project Cycle and modeling paradigms.',
    icon: '🔬',
    level: 'BUILDER',
    criteria: 'Complete Unit 1 & Unit 2 lectures and quizzes.',
  },
  {
    id: 'badge-analyst',
    code: 'AI_ANALYST',
    title: '📊 AI Analyst',
    description: 'Calculated Confusion Matrix metrics with 100% precision.',
    icon: '📊',
    level: 'ANALYST',
    criteria: 'Solve Unit 3 Model Evaluation quizzes and numericals.',
  },
  {
    id: 'badge-creator',
    code: 'AI_CREATOR',
    title: '🤖 AI Creator',
    description: 'Solved CBSE Sample Papers and completed the full 7 Units.',
    icon: '🤖',
    level: 'CREATOR',
    criteria: 'Solve a CBSE Sample Paper and reach 90%+ progress.',
  },
];

// INITIAL STUDENTS
export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'student-1',
    fullName: 'Rahul Kumar',
    rollNumber: '24',
    classNumber: '10',
    school: 'Delhi Public School, R.K. Puram',
    email: 'rahul.kumar24@dps.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    registeredAt: '2026-08-01T08:30:00Z',
    lastActive: '2026-09-25T14:20:00Z',
    courseProgress: 68,
    learningStreakDays: 5,
  },
  {
    id: 'student-2',
    fullName: 'Ananya Sharma',
    rollNumber: '12',
    classNumber: '10',
    school: 'Kendriya Vidyalaya No. 1, Delhi Cantt',
    email: 'ananya.s12@kv.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    registeredAt: '2026-08-05T09:15:00Z',
    lastActive: '2026-09-24T18:40:00Z',
    courseProgress: 82,
    learningStreakDays: 12,
  },
  {
    id: 'student-3',
    fullName: 'Aarav Patel',
    rollNumber: '05',
    classNumber: '10',
    school: 'Modern School, Barakhamba Road',
    email: 'aarav.patel@modern.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    registeredAt: '2026-08-10T11:00:00Z',
    lastActive: '2026-09-25T11:10:00Z',
    courseProgress: 45,
    learningStreakDays: 3,
  },
];

// INITIAL LECTURE PROGRESS — Cleared since no lectures are currently uploaded
export const INITIAL_PROGRESS: LectureProgress[] = [];

// INITIAL QUIZ ATTEMPTS
export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [];

// INITIAL BOOKMARKS
export const INITIAL_BOOKMARKS: BookmarkItem[] = [];

// ANNOUNCEMENTS
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '📘 Class 10 AI Curriculum Ready (7 Units)',
    content: 'All 7 syllabus units are structured. Video lectures will be uploaded soon from the Admin Portal. In the meantime, browse the CBSE Sample Papers, revision notes, and submit any lecture requests!',
    category: 'GENERAL',
    isPinned: true,
    publishedAt: '2026-09-25T12:00:00Z',
  },
  {
    id: 'ann-2',
    title: '📄 CBSE Sample Question Papers & Marking Scheme 2024-25',
    content: 'Official CBSE SQP and detailed Marking Scheme for Subject Code 417 are published in the "CBSE Sample Papers" section. You can view, solve, and print them in the in-app PDF Viewer.',
    category: 'NOTES',
    isPinned: true,
    publishedAt: '2026-09-25T09:00:00Z',
  },
  {
    id: 'ann-3',
    title: '💬 Student Suggestions & Lecture Requests Portal Active',
    content: 'Have a specific lecture request, syllabus doubt, or question? Send a message to the Admin using the "Suggestions" section and get guidance.',
    category: 'GENERAL',
    isPinned: false,
    publishedAt: '2026-09-25T08:00:00Z',
  },
];

// INITIAL STUDENT SUGGESTIONS & MESSAGES
export const INITIAL_SUGGESTIONS: StudentSuggestionMessage[] = [
  {
    id: 'sug-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@school.edu.in',
    rollNumber: '24',
    category: 'LECTURE_REQUEST',
    unitTitle: 'Unit 3: Evaluating Models',
    subject: 'Request for Confusion Matrix step-by-step video lecture',
    message: 'Hello Admin Sir, could you please upload a detailed board numerical lecture on solving 5-mark Confusion Matrix problems with Precision, Recall, and F1 Score? We have our pre-board exam next month. Thank you!',
    createdAt: '2026-09-25T11:30:00Z',
    isRead: false,
    isStarred: true,
  },
  {
    id: 'sug-2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@school.edu.in',
    rollNumber: '18',
    category: 'DOUBT_QUERY',
    unitTitle: 'Unit 6: Natural Language Processing',
    subject: 'Doubt about Stemming vs Lemmatization with board example',
    message: 'Respected teacher, in the CBSE SQP there was a question asking the difference between Stemming (Porter) and Lemmatization (WordNet) with example. Could you please upload a video explanation? Thanks!',
    createdAt: '2026-09-25T14:15:00Z',
    isRead: false,
    isStarred: false,
  },
];
