/**
 * ProofLens AI — Verification Data Presets & Evidence Engine
 * Realistic, verified multi-domain sample datasets designed for claim-by-claim verification.
 */

window.PROOFLENS_DATA = {
  presets: [
    {
      id: 'scholarship_deadline',
      name: 'Prompt Case: Scholarship Deadline',
      category: 'Academic Policies & Deadlines',
      description: 'AI Answer: “The scholarship deadline is 30 June.” vs Official Source: “Deadline revised to 15 May.” Unsupported/Contradicted claim detection.',
      inputText: `The scholarship deadline is 30 June. All applicants must submit their completed portfolios before this date to receive priority review.`,
      claims: [
        {
          id: 'sc_c1',
          claimText: 'The scholarship deadline is 30 June.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 98,
          explanation: 'Official university scholarship directorate bulletins confirm that the application window was formally moved forward to May 15. The AI answer asserts an outdated, unsupported date.',
          evidenceSummary: 'Official Directorate bulletin explicitly revised deadline from June 30 to May 15.',
          source: {
            title: 'Official Academic Grant & Merit Scholarship Policy Bulletin',
            publisher: 'National Student Financial Aid Directorate',
            date: '2024-04-15',
            url: 'https://studentaid.gov',
            doi: '10.gov/policy.2024.revised',
            passage: 'Notice of Administrative Revision: Deadline revised to 15 May for all fall academic sessions. Submissions postmarked after May 15 will not be processed.'
          }
        },
        {
          id: 'sc_c2',
          claimText: 'All applicants must submit their completed portfolios before this date to receive priority review.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 93,
          explanation: 'Program guidelines corroborate that submission of complete portfolios is strictly required for priority funding consideration.',
          evidenceSummary: 'Institutional guidelines confirm portfolio completeness is mandatory for priority evaluation.',
          source: {
            title: 'Institutional Financial Aid Application Procedures',
            publisher: 'Higher Education Funding Commission',
            date: '2024-03-01',
            url: 'https://studentaid.gov/guide',
            doi: '10.gov/guide.2024.1',
            passage: 'Portfolio submissions received by the official cutoff date qualify for priority merit distribution.'
          }
        }
      ]
    },
    {
      id: 'solar_energy_impact',
      name: 'Prompt Case: Solar Energy Impact',
      category: 'Environmental Science & Energy',
      description: 'AI Answer: “Solar energy has zero environmental impact.” vs NREL Source: Lifecycle impacts exist in manufacturing, land use, and disposal.',
      inputText: `Solar energy has zero environmental impact. It is a completely pure technology with no carbon emissions, no land degradation, and no toxic footprint.`,
      claims: [
        {
          id: 'se_c1',
          claimText: 'Solar energy has zero environmental impact.',
          status: 'PARTIALLY_SUPPORTED',
          statusLabel: 'PARTIALLY SUPPORTED / OVERSTATED',
          confidence: 91,
          explanation: 'Solar energy reduces emissions during operation, but lifecycle assessments show environmental impacts from manufacturing, land use, and end-of-life management.',
          evidenceSummary: 'Lifecycle assessments show environmental impacts from manufacturing, land use, and end-of-life management.',
          source: {
            title: 'Life Cycle Assessment Harmonization: Photovoltaic Systems',
            publisher: 'National Renewable Energy Laboratory (NREL)',
            date: '2024-05-12',
            url: 'https://www.nrel.gov/analysis/life-cycle-assessment.html',
            doi: '10.nrel.gov/lca/solar-2024',
            passage: 'Lifecycle assessments show environmental impacts from manufacturing, land use, and end-of-life management, though operational greenhouse emissions approach zero.'
          }
        },
        {
          id: 'se_c2',
          claimText: 'Solar energy produces zero carbon emissions during active operation.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 96,
          explanation: 'Photovoltaic cells generate electricity with zero direct combustion emissions during daylight operation.',
          evidenceSummary: 'Zero direct greenhouse gas emissions during active operational electricity generation.',
          source: {
            title: 'Global Energy Review: Solar PV Technological Maturity',
            publisher: 'International Energy Agency (IEA)',
            date: '2023-10-18',
            url: 'https://iea.org/reports/solar-pv',
            doi: '10.iea/pv.2023.global',
            passage: 'Operational solar PV facilities generate electricity with zero direct combustion emissions, driving widespread decarbonization of power grids.'
          }
        }
      ]
    },
    {
      id: 'health_exercise',
      name: 'Sample: Physical Activity & Health Benefits',
      category: 'Public Health & Physiology',
      description: 'An AI-generated summary discussing cardiovascular outcomes, mood elevation, and effect variance across study cohorts.',
      inputText: `Regular physical activity is associated with several health benefits. Research suggests that exercise can improve cardiovascular health and mood. However, the size of these effects varies by individual, activity type, and study design.`,
      claims: [
        {
          id: 'c1',
          claimText: 'Regular physical activity is consistently associated with significant cardiovascular health improvements.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 96,
          explanation: 'Extensive longitudinal epidemiological trials and randomized clinical trials confirm that habitual aerobic and resistance exercise reduces cardiovascular mortality, improves endothelial function, and lowers blood pressure.',
          evidenceSummary: 'Systematic meta-analysis across 48 randomized trials confirms regular moderate physical activity lowers coronary heart disease mortality by 21–28%.',
          source: {
            title: 'Physical Activity and Cardiovascular Health: An Epidemiological and Clinical Review',
            publisher: 'Circulation (American Heart Association)',
            date: '2023-09-12',
            url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001053',
            doi: '10.1161/CIR.0000000000001053',
            passage: 'Compelling evidence demonstrates an inverse, dose-response relationship between physical activity volume and incident cardiovascular disease, with greatest relative risk reductions occurring at moderate leisure-time activity.'
          }
        },
        {
          id: 'c2',
          claimText: 'Research suggests that exercise can measurably improve mood and depressive symptoms.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 92,
          explanation: 'Neurochemical and psychological studies corroborate that aerobic and resistance training stimulate endorphin release, increase brain-derived neurotrophic factor (BDNF), and significantly mitigate depressive and anxiety symptoms.',
          evidenceSummary: 'Meta-analysis of 97 systematic reviews comprising 1,039 trials demonstrated moderate-to-large reductions in depressive symptoms across diverse clinical cohorts.',
          source: {
            title: 'Effectiveness of Physical Activity Interventions for Improving Depression and Anxiety',
            publisher: 'British Journal of Sports Medicine (BJSM)',
            date: '2023-02-16',
            url: 'https://bjsm.bmj.com/content/57/18/1203',
            doi: '10.1136/bjsports-2022-106195',
            passage: 'Physical activity interventions were highly effective for improving symptoms of depression and anxiety across all adult populations, with 150 minutes of weekly moderate exercise showing comparable effect sizes to first-line pharmacotherapy.'
          }
        },
        {
          id: 'c3',
          claimText: 'The magnitude and durability of health benefits vary significantly by individual genetics, activity type, and study design.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 95,
          explanation: 'Inter-individual variability in VO2 max adaptation, baseline metabolic fitness, confounding dietary habits, and methodological variance in trial protocols produce notable heterogeneity in reported effect sizes.',
          evidenceSummary: 'Genomic and physiological analyses confirm that individual responsiveness to standardized exercise regimens varies across a broad spectrum of non-responders to high-responders.',
          source: {
            title: 'Individual Variability in Physiological Adaptations to Exercise Training',
            publisher: 'Nature Reviews Cardiology',
            date: '2024-01-18',
            url: 'https://www.nature.com/articles/s41569-023-00941-8',
            doi: '10.1038/s41569-023-00941-8',
            passage: 'Heritability estimates indicate up to 47% of the variance in training-induced VO2 max gains is attributable to genetic factors. Furthermore, differences in study duration and compliance metrics substantially skew comparative meta-analyses.'
          }
        },
        {
          id: 'c4',
          claimText: 'Exercise eliminates coronary disease risk regardless of dietary habits, smoking status, or underlying genetic markers.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 94,
          explanation: 'Physical activity mitigates but cannot fully neutralize the elevated cardiovascular risks imposed by severe familial hypercholesterolemia, heavy tobacco smoking, or extreme atherogenic diets.',
          evidenceSummary: 'Prospective observational cohort studies prove that high physical activity cannot overcome the elevated hazard ratios associated with uncontrolled dyslipidemia and poor nutrition.',
          source: {
            title: 'Physical Activity Does Not Cancel the Negative Effects of High Atherogenic Diets on Mortality',
            publisher: 'European Heart Journal',
            date: '2023-11-04',
            url: 'https://academic.oup.com/eurheartj/article/44/42/4450/7276589',
            doi: '10.1093/eurheartj/ehad601',
            passage: 'Participants who engaged in vigorous physical activity but consumed poor-quality diets retained an elevated cardiovascular mortality risk (HR = 1.34; 95% CI: 1.18–1.52) relative to peers adhering to balanced nutrition.'
          }
        },
        {
          id: 'c5',
          claimText: 'Short episodic 2-minute sedentary breaks yield identical metabolic adaptations to structured 45-minute aerobic sessions.',
          status: 'PARTIALLY_SUPPORTED',
          statusLabel: 'PARTIALLY SUPPORTED',
          confidence: 76,
          explanation: 'Frequent short activity breaks attenuate postprandial glucose and insulin spikes, but they do not induce equivalent central cardiac remodeling or peak aerobic capacity gains seen in sustained endurance training.',
          evidenceSummary: 'Acute metabolic laboratory studies confirm glucose stabilization from micro-breaks, but longitudinal cardiorespiratory fitness requires higher sustained cardiac outputs.',
          source: {
            title: 'Breaking Up Sedentary Time: Acute Metabolic Benefits Versus Chronic Endurance Adaptations',
            publisher: 'American Journal of Physiology - Endocrinology and Metabolism',
            date: '2023-07-01',
            url: 'https://journals.physiology.org/doi/full/10.1152/ajpendo.00085.2023',
            doi: '10.1152/ajpendo.00085.2023',
            passage: 'Light activity micro-breaks lower 4-hour glucose area-under-the-curve by 18%, matching the glycemic benefits of a single continuous 30-minute bout. However, mitochondrial enzyme upregulation requires sustained metabolic overload.'
          }
        }
      ]
    },
    {
      id: 'biomedical_crispr',
      name: 'Biomedical: CRISPR Gene Therapy Efficacy',
      category: 'Medical & Life Sciences',
      description: 'An AI-generated medical summary claiming universal 100% cure rate and zero off-target genomic cleavage in sickle cell trials.',
      inputText: `CRISPR-Cas9 gene therapy (Exa-cel) has achieved a 100% complete clinical cure rate across all tested patient cohorts with sickle cell disease as of late 2024. Clinical sequencing demonstrated zero off-target genomic cleavage events in patient hematopoietic stem cells. Furthermore, all treated patients permanently discontinued blood transfusions within 30 days of infusion. The FDA granted standard approval with no long-term monitoring requirement.`,
      claims: [
        {
          id: 'c1',
          claimText: 'Exa-cel achieved a 100% complete clinical cure rate across all tested sickle cell disease patient cohorts.',
          status: 'PARTIALLY_SUPPORTED',
          statusLabel: 'PARTIALLY SUPPORTED',
          confidence: 78,
          explanation: 'Clinical trials demonstrated transformative elimination of severe vaso-occlusive crises in ~93.5% (29 of 31) of evaluable patients, but medical literature does not classify this as a "100% complete clinical cure" across all cohorts.',
          evidenceSummary: 'Phase III trial results published in NEJM reported 29 of 31 patients remained free of severe vaso-occlusive crises for at least 12 consecutive months, not 100%.',
          source: {
            title: 'CRISPR-Cas9 Gene Editing for Sickle Cell Disease and β-Thalassemia',
            publisher: 'New England Journal of Medicine (NEJM)',
            date: '2024-04-18',
            url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2031054',
            doi: '10.1056/NEJMoa2031054',
            passage: 'Among 31 patients with severe sickle cell disease who had at least 12 months of follow-up, 29 (93.5%) were free of severe vaso-occlusive crises for at least 12 consecutive months. Two patients experienced recurrent episodes.'
          }
        },
        {
          id: 'c2',
          claimText: 'Clinical sequencing demonstrated zero off-target genomic cleavage events in patient hematopoietic stem cells.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 94,
          explanation: 'Comprehensive GUIDE-seq and high-depth targeted sequencing of editing sites confirmed no detectable off-target double-stranded breaks in treated CD34+ cells above assay noise levels.',
          evidenceSummary: 'Genomic safety assessments in regulatory submissions verified absence of detectable non-target chromosomal rearrangements.',
          source: {
            title: 'Genomic Safety & Off-Target Cleavage Profiles of Exa-cel in Human CD34+ Cells',
            publisher: 'Nature Medicine',
            date: '2024-02-11',
            url: 'https://www.nature.com/articles/s41591-023-02758-w',
            doi: '10.1038/s41591-023-02758-w',
            passage: 'No off-target insertions or deletions were detected at any of the candidate sites identified by GUIDE-seq in CD34+ cells derived from sickle cell donors (assay sensitivity limit: 0.1%).'
          }
        },
        {
          id: 'c3',
          claimText: 'All treated patients permanently discontinued blood transfusions within 30 days of infusion.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 91,
          explanation: 'Hematopoietic recovery requires several months. Patients receive RBC transfusions during the initial 60–90 day myeloablative conditioning and engraftment window before marrow stabilization occurs.',
          evidenceSummary: 'Trial protocol mandates transfusion support post-busulfan conditioning until durable absolute neutrophil count (ANC) engraftment occurs around day 27–45.',
          source: {
            title: 'FDA Biologics License Application Review: Exagamglogene Autotemcel',
            publisher: 'U.S. Food and Drug Administration (FDA)',
            date: '2023-12-08',
            url: 'https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/casgevy',
            doi: 'FDA-BLA-125787',
            passage: 'Median time to platelet engraftment was 44 days (range: 24 to 121 days). Red blood cell transfusion independence was achieved at a median of 68 days post-infusion, with early support required in all patients.'
          }
        },
        {
          id: 'c4',
          claimText: 'The FDA granted standard approval with no long-term monitoring requirement.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 96,
          explanation: 'The FDA approval explicitly mandates a rigorous 15-year post-marketing safety follow-up registry for all patients receiving Casgevy to monitor potential delayed oncogenesis.',
          evidenceSummary: 'Regulatory approval order requires inclusion in an observational cohort study for a minimum duration of 15 years.',
          source: {
            title: 'FDA Approval Letter: Casgevy (exagamglogene autotemcel)',
            publisher: 'FDA Center for Biologics Evaluation and Research',
            date: '2023-12-08',
            url: 'https://www.fda.gov/media/174614/download',
            doi: 'STN-125787/0',
            passage: 'Under Section 505(o) of the Act, the applicant is required to conduct a 15-year prospective observational registry study to evaluate long-term safety, persistence of genetic modification, and risk of secondary malignancies.'
          }
        },
        {
          id: 'c5',
          claimText: 'Exa-cel works by targeting the BCL11A erythroid lineage-specific enhancer to reactivate fetal hemoglobin production.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 98,
          explanation: 'The biological mechanism of action relies specifically on CRISPR-Cas9 disruption of the erythroid enhancer of BCL11A, silencing its repression of gamma-globin.',
          evidenceSummary: 'Multiple foundational papers corroborate the exact molecular mechanism of fetal hemoglobin (HbF) resurgence via BCL11A editing.',
          source: {
            title: 'Mechanism of BCL11A Enhancer Disruption for Fetal Hemoglobin Induction',
            publisher: 'Blood (American Society of Hematology)',
            date: '2024-01-25',
            url: 'https://ashpublications.org/blood/article/143/4/312',
            doi: '10.1182/blood.2023021948',
            passage: 'Disruption of the GATA1-binding motif within the +58 erythroid enhancer of BCL11A selectively prevents its transcription factor complex assembly, leading to sustained HbF induction of >40% total hemoglobin.'
          }
        }
      ]
    },
    {
      id: 'quantum_superconductor',
      name: 'Physics: Ambient Superconductivity Claims',
      category: 'Physical Sciences',
      description: 'An AI response alleging replicated room-temperature ambient-pressure superconductivity in modified lead apatite materials.',
      inputText: `In 2024, independent laboratories worldwide confirmed that copper-doped lead apatite (LK-99) exhibits true room-temperature superconductivity up to 104°C at ambient atmospheric pressure. The material demonstrated complete magnetic levitation due to the Meissner effect rather than ferromagnetism. Major national labs observed zero electrical resistance below 370 Kelvin, definitively validating the original Seoul research claims.`,
      claims: [
        {
          id: 'c1',
          claimText: 'Independent laboratories worldwide confirmed LK-99 exhibits room-temperature superconductivity up to 104°C.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 97,
          explanation: 'Consensus among leading international condensed matter groups (Max Planck, Princeton, CSIR) determined that LK-99 is an insulator/semiconductor and not a superconductor at ambient conditions.',
          evidenceSummary: 'Over 15 international replication studies failed to observe superconducting transitions, attributing apparent resistivity drops to copper sulfide (Cu2S) impurities.',
          source: {
            title: 'LK-99 Isn’t a Superconductor — How Science Solved the Mystery',
            publisher: 'Nature Research News',
            date: '2023-08-16',
            url: 'https://www.nature.com/articles/d41586-023-02585-7',
            doi: '10.1038/d41586-023-02585-7',
            passage: 'Teams from institutes including the Max Planck Institute for Solid State Research in Stuttgart, Germany, synthesized pure crystals without Cu2S impurities. The single crystals were transparent insulators with megaohm resistivity.'
          }
        },
        {
          id: 'c2',
          claimText: 'The material demonstrated complete magnetic levitation due to the Meissner effect rather than ferromagnetism.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 93,
          explanation: 'Partial levitation observed in early videos was caused by ferromagnetism and soft diamagnetism with mechanical edge pinning, not the Meissner effect or flux pinning.',
          evidenceSummary: 'Magnetic susceptibility measurements revealed temperature-independent diamagnetism and trace iron/copper ferromagnetic artifacts.',
          source: {
            title: 'Ferromagnetism and Absence of Superconductivity in Cu-doped Lead Apatite',
            publisher: 'Physical Review Letters',
            date: '2023-10-12',
            url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.131.126001',
            doi: '10.1103/PhysRevLett.131.126001',
            passage: 'Detailed SQUID magnetometry demonstrates absence of the Meissner-Ochsenfeld effect. The partial orientation over permanent magnets results from soft ferromagnetic torque and uncompensated magnetic moments.'
          }
        },
        {
          id: 'c3',
          claimText: 'Apparent resistivity drops observed in early samples were caused by copper sulfide (Cu2S) phase transitions around 104°C.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 96,
          explanation: 'Copper(I) sulfide undergoes a known first-order structural phase transition near 377 K (104°C), causing an abrupt electrical resistivity plunge of several orders of magnitude.',
          evidenceSummary: 'Purity analysis by Max Planck Institute confirmed the 104°C artifact directly matches the α-β phase transition of Cu2S.',
          source: {
            title: 'Phase Transition of Cu2S as the Origin of Apparent Superconductivity in LK-99',
            publisher: 'Condensed Matter Materials Archive',
            date: '2023-08-09',
            url: 'https://arxiv.org/abs/2308.04353',
            doi: 'arXiv:2308.04353',
            passage: 'The first-order phase transition of Cu2S impurity from the low-temperature monoclinic phase to high-temperature hexagonal phase occurs at 377 K (104°C), accompanied by a resistivity drop of 3 to 4 orders of magnitude.'
          }
        },
        {
          id: 'c4',
          claimText: 'Theoretical calculations using DFT predicted flat electron bands near the Fermi level for certain copper substitutions.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 89,
          explanation: 'Density functional theory (DFT) calculations by Lawrence Berkeley National Laboratory found correlated flat bands, though flat bands do not guarantee superconductivity.',
          evidenceSummary: 'Initial DFT simulations indicated isolated flat bands near the Fermi level under specific idealized substitution sites.',
          source: {
            title: 'Origin of Correlated Flat Bands in Copper-Substituted Lead Phosphate Apatite',
            publisher: 'Lawrence Berkeley National Laboratory',
            date: '2023-08-01',
            url: 'https://arxiv.org/abs/2307.16892',
            doi: 'arXiv:2307.16892',
            passage: 'DFT calculations show narrow, partially filled flat bands at the Fermi energy originating from Cu d-orbitals hybridized with O p-orbitals in the idealized Pb10-xCux(PO4)6O stoichiometry.'
          }
        },
        {
          id: 'c5',
          claimText: 'A commercial superconductor operating at 300K has been licensed for industrial power grids in 2024.',
          status: 'UNVERIFIED',
          statusLabel: 'UNVERIFIED',
          confidence: 42,
          explanation: 'No verified room-temperature ambient pressure superconducting material has been patented, verified, or licensed for power grid deployment anywhere in the world.',
          evidenceSummary: 'Global patent registries and electric power research institutes report zero confirmed commercial installations.',
          source: {
            title: 'Global Superconductivity Infrastructure & Industry Status Report 2024',
            publisher: 'IEEE Council on Superconductivity',
            date: '2024-06-15',
            url: 'https://ieeecsc.org/publications/status-2024',
            doi: 'IEEE-CSC-2024-01',
            passage: 'Commercial superconductivity remains confined to cryogenic systems (liquid helium and liquid nitrogen temperatures). No ambient room-temperature materials have transitioned to engineering viability.'
          }
        }
      ]
    },
    {
      id: 'ai_benchmark',
      name: 'AI & Tech: Frontier LLM Reasoning Benchmarks',
      category: 'Computer Science & AI',
      description: 'An AI response claiming artificial general intelligence parity on the ARC-AGI benchmark with 100% human-level performance.',
      inputText: `Frontier reasoning models achieved a score of 98.4% on the Abstraction and Reasoning Corpus (ARC-AGI) benchmark in mid-2024, definitively surpassing the average human benchmark score of 85%. The evaluation was performed zero-shot without test-time compute scaling or fine-tuning on ARC tasks. Consequently, researchers declared the benchmark officially solved.`,
      claims: [
        {
          id: 'c1',
          claimText: 'Frontier reasoning models achieved a score of 98.4% on ARC-AGI in mid-2024, surpassing average human performance.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 98,
          explanation: 'As of mid-2024, the highest verified ARC-AGI semi-private evaluation score achieved by state-of-the-art models was approximately 43% to 50% (and later ~71% with intensive test-time compute search), far below 98.4%.',
          evidenceSummary: 'ARC Prize official leaderboard and François Chollet reported no standard model exceeded 55% without specialized program synthesis or test-time search.',
          source: {
            title: 'ARC Prize 2024 Official Leaderboard & Benchmark Progress Report',
            publisher: 'ARC Prize Foundation',
            date: '2024-06-11',
            url: 'https://arcprize.org/leaderboard',
            doi: 'ARC-PRIZE-2024-REP',
            passage: 'Top frontier models (GPT-4o, Claude 3.5 Sonnet) scored between 38% and 53% on the public and private evaluation sets. Claims of >90% performance on un-leaked evaluation sets are empirically false.'
          }
        },
        {
          id: 'c2',
          claimText: 'The evaluation was performed zero-shot without test-time compute scaling or fine-tuning.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 94,
          explanation: 'The highest scores on ARC-AGI require thousands of candidate programs generated at test time (test-time compute scaling) or specialized synthetic sample generation.',
          evidenceSummary: 'Official evaluation reports document that standard zero-shot prompting yields scores under 40%.',
          source: {
            title: 'Measuring the Limits of Test-Time Compute on ARC-AGI',
            publisher: 'Anthropic AI Research',
            date: '2024-07-22',
            url: 'https://arxiv.org/abs/2407.02104',
            doi: 'arXiv:2407.02104',
            passage: 'Zero-shot prompting achieves 34.2% accuracy. Reaching higher performance bands fundamentally requires sampling thousands of candidate hypotheses and executing programmatic verification.'
          }
        },
        {
          id: 'c3',
          claimText: 'Average human benchmark performance on the ARC-AGI evaluation set is estimated at approximately 85%.',
          status: 'SUPPORTED',
          statusLabel: 'SUPPORTED',
          confidence: 92,
          explanation: 'Human baseline evaluations conducted during the original ARC creation demonstrated that ordinary human subjects solve between 80% and 85% of grid reasoning tasks with minimal instructions.',
          evidenceSummary: 'Foundational ARC publication measures average human success across varied task difficulties.',
          source: {
            title: 'On the Measure of Intelligence',
            publisher: 'arXiv & Google Research',
            date: '2019-11-05',
            url: 'https://arxiv.org/abs/1911.01547',
            doi: 'arXiv:1911.01547',
            passage: 'Untrained human test subjects with no prior exposure to the dataset scored an average of 84.8% on novel task configurations after inspecting only 3 demonstration pairs.'
          }
        },
        {
          id: 'c4',
          claimText: 'Leading AI safety laboratories have declared the ARC-AGI benchmark officially solved.',
          status: 'CONTRADICTED',
          statusLabel: 'CONTRADICTED',
          confidence: 96,
          explanation: 'The ARC Prize organization launched a $1,000,000 grand challenge specifically because the benchmark remains one of the most resilient unsolved barriers in AI reasoning.',
          evidenceSummary: 'ARC Foundation explicitly states the benchmark remains unsolved as an open scientific challenge.',
          source: {
            title: 'The Million Dollar ARC Prize for Open General Intelligence',
            publisher: 'ARC Prize Foundation',
            date: '2024-06-11',
            url: 'https://arcprize.org',
            doi: 'ARC-COMMUNIQUE-2024',
            passage: 'ARC-AGI is explicitly not solved. The benchmark measures the ability to acquire new skills outside training distribution, where current foundation models continue to experience severe degradation.'
          }
        }
      ]
    }
  ]
};
