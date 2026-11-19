export type SubjectName = 'Physics' | 'Chemistry' | 'Mathematics';
export type Chapter = {name:string;topics:string;level:11|12};
export const syllabus:Record<SubjectName,Chapter[]> = {
  "Physics": [
    {
      "name": "Units and Measurements",
      "topics": "SI units, dimensions and errors",
      "level": 11
    },
    {
      "name": "Motion in a Straight Line",
      "topics": "Graphs, velocity and acceleration",
      "level": 11
    },
    {
      "name": "Motion in a Plane",
      "topics": "Vectors, projectiles and circular motion",
      "level": 11
    },
    {
      "name": "Laws of Motion",
      "topics": "Newton's laws, friction and impulse",
      "level": 11
    },
    {
      "name": "Work, Energy and Power",
      "topics": "Energy, work and collisions",
      "level": 11
    },
    {
      "name": "System of Particles and Rotational Motion",
      "topics": "Torque, angular momentum and moment of inertia",
      "level": 11
    },
    {
      "name": "Gravitation",
      "topics": "Gravitational field, potential and satellites",
      "level": 11
    },
    {
      "name": "Mechanical Properties of Solids",
      "topics": "Stress, strain and elastic moduli",
      "level": 11
    },
    {
      "name": "Mechanical Properties of Fluids",
      "topics": "Fluid pressure, viscosity and Bernoulli principle",
      "level": 11
    },
    {
      "name": "Thermal Properties of Matter",
      "topics": "Expansion, calorimetry and heat transfer",
      "level": 11
    },
    {
      "name": "Thermodynamics",
      "topics": "Laws of thermodynamics and engines",
      "level": 11
    },
    {
      "name": "Kinetic Theory",
      "topics": "Ideal gases and degrees of freedom",
      "level": 11
    },
    {
      "name": "Oscillations",
      "topics": "SHM, pendulum and resonance",
      "level": 11
    },
    {
      "name": "Waves",
      "topics": "Wave motion, superposition and Doppler effect",
      "level": 11
    },
    {
      "name": "Electric Charges and Fields",
      "topics": "Coulomb's law, fields and Gauss theorem",
      "level": 12
    },
    {
      "name": "Electrostatic Potential and Capacitance",
      "topics": "Potential, capacitors and dielectrics",
      "level": 12
    },
    {
      "name": "Current Electricity",
      "topics": "Ohm's law, circuits and bridges",
      "level": 12
    },
    {
      "name": "Moving Charges and Magnetism",
      "topics": "Magnetic forces, Biot-Savart and Ampere laws",
      "level": 12
    },
    {
      "name": "Magnetism and Matter",
      "topics": "Magnetic materials and Earth's field",
      "level": 12
    },
    {
      "name": "Electromagnetic Induction",
      "topics": "Faraday and Lenz laws, inductance",
      "level": 12
    },
    {
      "name": "Alternating Current",
      "topics": "RMS, LCR circuits and transformers",
      "level": 12
    },
    {
      "name": "Electromagnetic Waves",
      "topics": "Displacement current and EM spectrum",
      "level": 12
    },
    {
      "name": "Ray Optics and Optical Instruments",
      "topics": "Mirrors, lenses, prisms and instruments",
      "level": 12
    },
    {
      "name": "Wave Optics",
      "topics": "Interference, diffraction and polarisation",
      "level": 12
    },
    {
      "name": "Dual Nature of Radiation and Matter",
      "topics": "Photoelectric effect and de Broglie waves",
      "level": 12
    },
    {
      "name": "Atoms",
      "topics": "Bohr model and atomic spectra",
      "level": 12
    },
    {
      "name": "Nuclei",
      "topics": "Radioactivity, fission and fusion",
      "level": 12
    },
    {
      "name": "Semiconductor Electronics",
      "topics": "Diodes, rectifiers and logic gates",
      "level": 12
    }
  ],
  "Chemistry": [
    {
      "name": "Some Basic Concepts of Chemistry",
      "topics": "Mole concept and stoichiometry",
      "level": 11
    },
    {
      "name": "Structure of Atom",
      "topics": "Quantum numbers and electronic structure",
      "level": 11
    },
    {
      "name": "Classification of Elements and Periodicity",
      "topics": "Periodic trends and classification",
      "level": 11
    },
    {
      "name": "Chemical Bonding and Molecular Structure",
      "topics": "VSEPR, hybridisation and MOT",
      "level": 11
    },
    {
      "name": "Thermodynamics",
      "topics": "Enthalpy, entropy and Gibbs energy",
      "level": 11
    },
    {
      "name": "Equilibrium",
      "topics": "Chemical and ionic equilibrium, pH",
      "level": 11
    },
    {
      "name": "Redox Reactions",
      "topics": "Oxidation states and redox balancing",
      "level": 11
    },
    {
      "name": "Hydrogen",
      "topics": "Hydrides, water and hydrogen peroxide",
      "level": 11
    },
    {
      "name": "The s-Block Elements",
      "topics": "Alkali and alkaline earth metals",
      "level": 11
    },
    {
      "name": "The p-Block Elements (Groups 13 and 14)",
      "topics": "Boron and carbon families",
      "level": 11
    },
    {
      "name": "Organic Chemistry – Some Basic Principles and Techniques",
      "topics": "Nomenclature, isomerism and reaction effects",
      "level": 11
    },
    {
      "name": "Hydrocarbons",
      "topics": "Alkanes, alkenes, alkynes and arenes",
      "level": 11
    },
    {
      "name": "Environmental Chemistry",
      "topics": "Air, water and soil pollution",
      "level": 11
    },
    {
      "name": "The Solid State",
      "topics": "Unit cells, packing and defects",
      "level": 12
    },
    {
      "name": "Solutions",
      "topics": "Raoult's law and colligative properties",
      "level": 12
    },
    {
      "name": "Electrochemistry",
      "topics": "Nernst equation and conductance",
      "level": 12
    },
    {
      "name": "Chemical Kinetics",
      "topics": "Rate laws, order and Arrhenius equation",
      "level": 12
    },
    {
      "name": "Surface Chemistry",
      "topics": "Adsorption, catalysis and colloids",
      "level": 12
    },
    {
      "name": "General Principles and Processes of Isolation of Elements",
      "topics": "Extraction, metallurgy and refining",
      "level": 12
    },
    {
      "name": "The p-Block Elements (Groups 15 to 18)",
      "topics": "Nitrogen, oxygen, halogens and noble gases",
      "level": 12
    },
    {
      "name": "The d- and f-Block Elements",
      "topics": "Transition elements and lanthanoids",
      "level": 12
    },
    {
      "name": "Coordination Compounds",
      "topics": "Isomerism, bonding and nomenclature",
      "level": 12
    },
    {
      "name": "Haloalkanes and Haloarenes",
      "topics": "Substitution mechanisms and C–X bonds",
      "level": 12
    },
    {
      "name": "Alcohols, Phenols and Ethers",
      "topics": "Reactions and preparation of oxygen compounds",
      "level": 12
    },
    {
      "name": "Aldehydes, Ketones and Carboxylic Acids",
      "topics": "Carbonyl reactions and carboxylic acidity",
      "level": 12
    },
    {
      "name": "Amines",
      "topics": "Basicity and diazonium chemistry",
      "level": 12
    },
    {
      "name": "Biomolecules",
      "topics": "Proteins, carbohydrates and nucleic acids",
      "level": 12
    },
    {
      "name": "Polymers",
      "topics": "Polymerisation and polymer classes",
      "level": 12
    },
    {
      "name": "Chemistry in Everyday Life",
      "topics": "Medicines, soaps and detergents",
      "level": 12
    }
  ],
  "Mathematics": [
    {
      "name": "Sets",
      "topics": "Set operations and Venn diagrams",
      "level": 11
    },
    {
      "name": "Relations and Functions",
      "topics": "Domain, range and Cartesian products",
      "level": 11
    },
    {
      "name": "Trigonometric Functions",
      "topics": "Identities and trigonometric equations",
      "level": 11
    },
    {
      "name": "Principle of Mathematical Induction",
      "topics": "Proof by mathematical induction",
      "level": 11
    },
    {
      "name": "Complex Numbers and Quadratic Equations",
      "topics": "Complex plane and quadratic roots",
      "level": 11
    },
    {
      "name": "Linear Inequalities",
      "topics": "Algebraic and graphical inequalities",
      "level": 11
    },
    {
      "name": "Permutations and Combinations",
      "topics": "Counting principles and combinations",
      "level": 11
    },
    {
      "name": "Binomial Theorem",
      "topics": "Expansion and general terms",
      "level": 11
    },
    {
      "name": "Sequences and Series",
      "topics": "AP, GP and special sums",
      "level": 11
    },
    {
      "name": "Straight Lines",
      "topics": "Slope and line equations",
      "level": 11
    },
    {
      "name": "Conic Sections",
      "topics": "Circles, parabolas, ellipses and hyperbolas",
      "level": 11
    },
    {
      "name": "Introduction to Three-Dimensional Geometry",
      "topics": "Coordinates and distances in 3D",
      "level": 11
    },
    {
      "name": "Limits and Derivatives",
      "topics": "Limits and basic differentiation",
      "level": 11
    },
    {
      "name": "Mathematical Reasoning",
      "topics": "Logic and statements",
      "level": 11
    },
    {
      "name": "Statistics",
      "topics": "Variance and standard deviation",
      "level": 11
    },
    {
      "name": "Probability",
      "topics": "Random experiments and probability laws",
      "level": 11
    },
    {
      "name": "Relations and Functions",
      "topics": "Equivalence relations and functions",
      "level": 12
    },
    {
      "name": "Inverse Trigonometric Functions",
      "topics": "Principal values and properties",
      "level": 12
    },
    {
      "name": "Matrices",
      "topics": "Operations and inverse matrices",
      "level": 12
    },
    {
      "name": "Determinants",
      "topics": "Cofactors and linear equations",
      "level": 12
    },
    {
      "name": "Continuity and Differentiability",
      "topics": "Continuity and differentiation rules",
      "level": 12
    },
    {
      "name": "Application of Derivatives",
      "topics": "Tangents, rates and extrema",
      "level": 12
    },
    {
      "name": "Integrals",
      "topics": "Definite and indefinite integration",
      "level": 12
    },
    {
      "name": "Application of Integrals",
      "topics": "Areas bounded by curves",
      "level": 12
    },
    {
      "name": "Differential Equations",
      "topics": "Order, degree and solutions",
      "level": 12
    },
    {
      "name": "Vector Algebra",
      "topics": "Dot and cross products",
      "level": 12
    },
    {
      "name": "Three-Dimensional Geometry",
      "topics": "Lines, planes and distances",
      "level": 12
    },
    {
      "name": "Linear Programming",
      "topics": "Graphical optimisation",
      "level": 12
    },
    {
      "name": "Probability",
      "topics": "Conditional probability and Bayes theorem",
      "level": 12
    }
  ]
};
export const syllabusNotice = 'Planning catalogue based on the supplied NCERT/AHSEC-aligned chapter list. This is not a verified 2027 official syllabus: older or deleted chapters may not be examined. Confirm the current ASSEB Division II syllabus and ASTU 2027 brochure before relying on chapter coverage.';
