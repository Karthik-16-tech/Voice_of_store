import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# ─── COLOR PALETTE ───
BG_OBSIDIAN = RGBColor(8, 10, 15)        # #080A0F
SURFACE_DARK = RGBColor(17, 21, 29)      # #11151D
PANEL_ELEVATED = RGBColor(23, 28, 38)    # #171C26
ACCENT_COBALT = RGBColor(71, 120, 255)   # #4778FF
ACCENT_ICE = RGBColor(145, 201, 255)     # #91C9FF
ACCENT_VIOLET = RGBColor(140, 121, 255)  # #8C79FF
TEXT_WHITE = RGBColor(244, 246, 252)     # #F4F6FC
TEXT_GRAY = RGBColor(147, 155, 173)      # #939BAD
ALERT_RED = RGBColor(255, 77, 109)       # #FF4D6D
MINT_GREEN = RGBColor(45, 212, 191)      # #2DD4BF
BORDER_SUBTLE = RGBColor(38, 45, 60)     # #262D3C
BORDER_COBALT = RGBColor(71, 120, 255)

FONT_HEAD = "Space Grotesk"
FONT_BODY = "Inter"
FONT_MONO = "IBM Plex Mono"

def add_bg(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_OBSIDIAN
    bg.line.color.rgb = BG_OBSIDIAN
    return bg

def add_header(slide, tag_text, title_text, category_code="VOX / RETAIL INTELLIGENCE"):
    # Category tag
    tb_cat = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8), Inches(0.3))
    tf_cat = tb_cat.text_frame
    tf_cat.word_wrap = True
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = f"{category_code}  •  {tag_text.upper()}"
    p_cat.font.name = FONT_MONO
    p_cat.font.size = Pt(9.5)
    p_cat.font.bold = True
    p_cat.font.color.rgb = ACCENT_ICE

    # Title
    tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(11.5), Inches(0.6))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.name = FONT_HEAD
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

    # Technical divider line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = BORDER_SUBTLE
    line.line.color.rgb = BORDER_SUBTLE

def create_panel(slide, left, top, width, height, bg_color=SURFACE_DARK, border_color=BORDER_SUBTLE):
    panel = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    panel.fill.solid()
    panel.fill.fore_color.rgb = bg_color
    panel.line.color.rgb = border_color
    panel.line.width = Pt(1)
    return panel

def build_pitch_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    assets_dir = r"C:\Users\sekha\Downloads\liquid-glass-effect-main\liquid-glass-effect-main\public\deck_assets"

    # ==========================================
    # SLIDE 1 — TITLE / PRODUCT REVEAL
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)

    # Ambient glow effect panel behind title
    glow = s1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.5), Inches(1.5), Inches(5.5), Inches(5.5))
    glow.fill.solid()
    glow.fill.fore_color.rgb = RGBColor(16, 28, 65)
    glow.line.fill.background()

    # Left Typographic Block
    tb1_badge = s1.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(5), Inches(0.35))
    p = tb1_badge.text_frame.paragraphs[0]
    p.text = "AI FRONTIER CHALLENGE 2026  |  SUBMISSION"
    p.font.name = FONT_MONO
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_COBALT

    # Main Title
    tb1_title = s1.shapes.add_textbox(Inches(0.75), Inches(1.3), Inches(5.5), Inches(1.8))
    tf1 = tb1_title.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "VOICE OF STORE"
    p1.font.name = FONT_HEAD
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE

    p2 = tf1.add_paragraph()
    p2.text = "Hear the signal. Locate the problem. Drive the action."
    p2.font.name = FONT_HEAD
    p2.font.size = Pt(13)
    p2.font.italic = True
    p2.font.color.rgb = ACCENT_ICE
    p2.space_before = Pt(8)

    p3 = tf1.add_paragraph()
    p3.text = "AI-Powered Retail Intelligence & Autonomous Store Operations"
    p3.font.name = FONT_BODY
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_GRAY
    p3.space_before = Pt(6)

    # Submission Information Strip
    panel_info = create_panel(s1, Inches(0.8), Inches(4.3), Inches(4.6), Inches(2.2), PANEL_ELEVATED, BORDER_SUBTLE)
    tb1_info = s1.shapes.add_textbox(Inches(0.95), Inches(4.4), Inches(4.3), Inches(2.0))
    tf_info = tb1_info.text_frame
    tf_info.word_wrap = True
    
    rows = [
        ("TRACK", "Enterprise AI & Autonomous Retail Operations"),
        ("TEAM NAME", "[Enter Team Name]"),
        ("TEAM LEADER", "[Enter Leader Name]"),
        ("SUBMISSION DATE", "8/7/2026  •  ROUND 1"),
        ("INTELLIGENCE ENGINE", "Gemini 2.0 Flash  +  Spline 3D Core"),
    ]
    for i, (label, val) in enumerate(rows):
        p_row = tf_info.paragraphs[0] if i == 0 else tf_info.add_paragraph()
        p_row.text = f"{label: <20} :  {val}"
        p_row.font.name = FONT_MONO
        p_row.font.size = Pt(9.5)
        p_row.font.color.rgb = TEXT_WHITE if i > 0 else ACCENT_ICE
        if i > 0:
            p_row.space_before = Pt(4)

    # Right Hero Frame: Occupying ~65% of composition
    panel_hero = create_panel(s1, Inches(5.7), Inches(0.9), Inches(6.8), Inches(5.6), SURFACE_DARK, BORDER_COBALT)
    
    # Check screenshot
    hero_img_path = os.path.join(assets_dir, "devtools_test_1792326672504.png")
    if os.path.exists(hero_img_path):
        s1.shapes.add_picture(hero_img_path, Inches(5.75), Inches(0.95), Inches(6.7), Inches(5.5))
    else:
        # Fallback frame
        tb_hf = s1.shapes.add_textbox(Inches(5.7), Inches(3.2), Inches(6.8), Inches(1))
        p_hf = tb_hf.text_frame.paragraphs[0]
        p_hf.alignment = PP_ALIGN.CENTER
        p_hf.text = "[VOICE OF STORE AI COPILOT — SPLINE 3D CORE & VOICE ASSISTANT]"
        p_hf.font.name = FONT_MONO
        p_hf.font.size = Pt(12)
        p_hf.font.color.rgb = ACCENT_ICE

    # ==========================================
    # SLIDE 2 — PROBLEM STATEMENT
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "Problem Statement", "Critical problems are hiding in everyday feedback.")

    # 3 Problem Columns
    cols_data = [
        (
            "01",
            "SIGNAL OVERLOAD",
            "Thousands of fragmented customer reviews, app ratings, cashier tickets, staff WhatsApp notes, and shift logs flood in every hour.",
            "Multilingual noise, slang, typos, and high volume bury critical operational issues before corporate teams notice.",
            "High Latency",
            ALERT_RED
        ),
        (
            "02",
            "OWNERSHIP GAP",
            "Customer complaints are disconnected from the physical store, affected equipment, or responsible department.",
            "Head office cannot tell if 'warm milk' is a Facilities failure (Freezer C4) or an Inventory delay (unstocked shelves).",
            "No Attribution",
            ALERT_RED
        ),
        (
            "03",
            "DELAYED RESOLUTION",
            "Maintenance expenses, technician dispatches, and compliance outcomes remain isolated in back-office accounting.",
            "Leadership cannot measure the real financial impact of store defects until end-of-quarter financial reviews.",
            "Financial Blindspot",
            ALERT_RED
        ),
    ]

    col_w = Inches(3.64)
    for i, (num, title, body1, body2, badge_txt, badge_col) in enumerate(cols_data):
        c_left = Inches(0.8 + i * 4.04)
        c_panel = create_panel(s2, c_left, Inches(1.6), col_w, Inches(4.0), SURFACE_DARK, BORDER_SUBTLE)

        tb = s2.shapes.add_textbox(c_left + Inches(0.2), Inches(1.75), col_w - Inches(0.4), Inches(3.7))
        tf = tb.text_frame
        tf.word_wrap = True

        # Number & Badge
        p_n = tf.paragraphs[0]
        p_n.text = f"FAILURE VECTOR {num}"
        p_n.font.name = FONT_MONO
        p_n.font.size = Pt(9)
        p_n.font.bold = True
        p_n.font.color.rgb = badge_col

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.name = FONT_HEAD
        p_t.font.size = Pt(17)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.space_before = Pt(6)

        p_b1 = tf.add_paragraph()
        p_b1.text = body1
        p_b1.font.name = FONT_BODY
        p_b1.font.size = Pt(11)
        p_b1.font.color.rgb = TEXT_GRAY
        p_b1.space_before = Pt(10)

        p_b2 = tf.add_paragraph()
        p_b2.text = body2
        p_b2.font.name = FONT_BODY
        p_b2.font.size = Pt(10.5)
        p_b2.font.color.rgb = RGBColor(190, 198, 215)
        p_b2.space_before = Pt(8)

    # Concrete Examples Callout Box at Bottom
    p_ex = create_panel(s2, Inches(0.8), Inches(5.8), Inches(11.733), Inches(1.15), PANEL_ELEVATED, BORDER_SUBTLE)
    tb_ex = s2.shapes.add_textbox(Inches(1.0), Inches(5.88), Inches(11.3), Inches(1.0))
    tf_ex = tb_ex.text_frame
    tf_ex.word_wrap = True

    p_ehead = tf_ex.paragraphs[0]
    p_ehead.text = "REAL-WORLD COST OF INACTION  •  CRITICAL VECTORS IDENTIFIED ACROSS 42 STORES"
    p_ehead.font.name = FONT_MONO
    p_ehead.font.size = Pt(9)
    p_ehead.font.bold = True
    p_ehead.font.color.rgb = ACCENT_ICE

    p_ebody = tf_ex.add_paragraph()
    p_ebody.text = "• Broken Freezer Solenoid: +4°C temp spike spoils $14k dairy cargo  |  • Allergen Label Mismatch: Almond batch #B-882 risks fatal anaphylaxis\n• POS Barcode Scanner Glitch: 22-min queues lose $3.2k/hr throughput  |  • Aisle Spill Slip Hazard: OSHA citation & customer liability"
    p_ebody.font.name = FONT_BODY
    p_ebody.font.size = Pt(10)
    p_ebody.font.color.rgb = TEXT_WHITE
    p_ebody.space_before = Pt(4)

    # ==========================================
    # SLIDE 3 — PROPOSED SOLUTION
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "Proposed Solution", "One intelligence layer. Every store. Faster action.")

    # Left: Hero Visual Frame (~60%)
    p_sol_img = create_panel(s3, Inches(0.8), Inches(1.6), Inches(7.2), Inches(4.3), SURFACE_DARK, BORDER_COBALT)
    img_app_path = os.path.join(assets_dir, "initial_page_view_1792326533757.png")
    if os.path.exists(img_app_path):
        s3.shapes.add_picture(img_app_path, Inches(0.85), Inches(1.65), Inches(7.1), Inches(4.2))

    # Right: 3 Core Capabilities
    sol_cards = [
        (
            "01  •  VOICE AI COPILOT",
            "Gemini 2.0 Flash Conversational Agent",
            "Hands-free operational briefings, dynamic time greetings ('Good morning, Sir'), 2-3 sentence executive triage, real-time telemetry refresh.",
            ACCENT_COBALT
        ),
        (
            "02  •  3D STORE DIGITAL TWIN",
            "Spatial Physical-to-Digital Mapping",
            "Visualizes 3D store interior, department zones (Bakery, Dairy, POS, HVAC), and live flashing incident markers with IoT sensor beacons.",
            ACCENT_ICE
        ),
        (
            "03  •  FEEDBACK-TO-RESOLUTION ENGINE",
            "Closed-Loop Sector Triage",
            "Classifies feedback into 4 sectors, prioritizes severity (Critical/High), routes to designated leads, and tracks itemized repair expenses.",
            ACCENT_VIOLET
        ),
    ]

    for j, (badge, title, desc, tone_col) in enumerate(sol_cards):
        c_top = Inches(1.6 + j * 1.48)
        p_sc = create_panel(s3, Inches(8.2), c_top, Inches(4.333), Inches(1.36), SURFACE_DARK, BORDER_SUBTLE)
        tb_sc = s3.shapes.add_textbox(Inches(8.35), c_top + Inches(0.08), Inches(4.0), Inches(1.2))
        tf_sc = tb_sc.text_frame
        tf_sc.word_wrap = True

        p_b = tf_sc.paragraphs[0]
        p_b.text = badge
        p_b.font.name = FONT_MONO
        p_b.font.size = Pt(8.5)
        p_b.font.bold = True
        p_b.font.color.rgb = tone_col

        p_t = tf_sc.add_paragraph()
        p_t.text = title
        p_t.font.name = FONT_HEAD
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.space_before = Pt(2)

        p_d = tf_sc.add_paragraph()
        p_d.text = desc
        p_d.font.name = FONT_BODY
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = TEXT_GRAY
        p_d.space_before = Pt(3)

    # Bottom Workflow Ribbon
    p_flow = create_panel(s3, Inches(0.8), Inches(6.1), Inches(11.733), Inches(0.85), PANEL_ELEVATED, BORDER_SUBTLE)
    tb_flow = s3.shapes.add_textbox(Inches(0.9), Inches(6.15), Inches(11.5), Inches(0.75))
    tf_flow = tb_flow.text_frame
    tf_flow.word_wrap = True

    p_flabel = tf_flow.paragraphs[0]
    p_flabel.text = "CLOSED-LOOP AUTONOMOUS PIPELINE"
    p_flabel.font.name = FONT_MONO
    p_flabel.font.size = Pt(8)
    p_flabel.font.bold = True
    p_flabel.font.color.rgb = ACCENT_COBALT

    p_fsteps = tf_flow.add_paragraph()
    p_fsteps.text = "LISTEN (Omni-Channel Voice)  ──►  CLASSIFY (Gemini NLP)  ──►  LOCATE (3D Twin)  ──►  ROUTE (Sector Lead)  ──►  RESOLVE (Runbook)  ──►  REPORT (Vector PDF)"
    p_fsteps.font.name = FONT_HEAD
    p_fsteps.font.size = Pt(11)
    p_fsteps.font.bold = True
    p_fsteps.font.color.rgb = TEXT_WHITE
    p_fsteps.space_before = Pt(3)

    # ==========================================
    # SLIDE 4 — DESIGN STEPS & ARCHITECTURE
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "Design Steps & Architecture", "Four-tier architectural model with six-stage development lifecycle.")

    # 4 Architecture Tier Panels (Left 65%)
    layers = [
        (
            "TIER 1  •  PRESENTATION LAYER",
            "React 19  •  TypeScript  •  Tailwind CSS  •  Vite  •  TanStack Router",
            "AI Copilot Voice Interface, Spline 3D Scene Viewport, Retail Operations Engine, Full-White PDF Document Modal.",
            ACCENT_COBALT
        ),
        (
            "TIER 2  •  INTELLIGENCE & CONVERSATION",
            "Google Gemini 2.0 Flash API  •  Web Speech Recognition  •  SpeechSynthesis TTS",
            "2-3 Sentence J.A.R.V.I.S. persona, audio regex normalizer, dynamic time greetings, automated incident severity triage.",
            ACCENT_ICE
        ),
        (
            "TIER 3  •  SPATIAL TWIN & INCIDENT TELEMETRY",
            "Spline 3D WebGL Engine  •  Three.js / Drei  •  Spatial Sector Nodes",
            "Physical store floor layout, equipment beacon coordinates (Freezer C4, Printer #B2, POS Switch 04), IoT telemetry pins.",
            ACCENT_VIOLET
        ),
        (
            "TIER 4  •  REPORTING & EXPENSE AUDIT",
            "A4 Vector Print Engine  •  DOM Print Isolation  •  FSMA & OSHA Sign-Off",
            "Cadence aggregation (Daily 412, Weekly 2,840, Monthly 12,840), itemized technician repair expenses ($380-$1,850).",
            MINT_GREEN
        ),
    ]

    for k, (tier_code, tech_stack, desc_text, color_tone) in enumerate(layers):
        l_top = Inches(1.6 + k * 1.25)
        p_tier = create_panel(s4, Inches(0.8), l_top, Inches(7.6), Inches(1.15), SURFACE_DARK, BORDER_SUBTLE)
        tb_t = s4.shapes.add_textbox(Inches(0.95), l_top + Inches(0.06), Inches(7.3), Inches(1.05))
        tf_t = tb_t.text_frame
        tf_t.word_wrap = True

        p_t1 = tf_t.paragraphs[0]
        p_t1.text = tier_code
        p_t1.font.name = FONT_MONO
        p_t1.font.size = Pt(8.5)
        p_t1.font.bold = True
        p_t1.font.color.rgb = color_tone

        p_t2 = tf_t.add_paragraph()
        p_t2.text = tech_stack
        p_t2.font.name = FONT_HEAD
        p_t2.font.size = Pt(11)
        p_t2.font.bold = True
        p_t2.font.color.rgb = TEXT_WHITE
        p_t2.space_before = Pt(2)

        p_t3 = tf_t.add_paragraph()
        p_t3.text = desc_text
        p_t3.font.name = FONT_BODY
        p_t3.font.size = Pt(9.5)
        p_t3.font.color.rgb = TEXT_GRAY
        p_t3.space_before = Pt(2)

    # Right Column: 6-Stage Development Lifecycle Timeline (35%)
    p_time = create_panel(s4, Inches(8.6), Inches(1.6), Inches(3.933), Inches(4.9), PANEL_ELEVATED, BORDER_SUBTLE)
    tb_time = s4.shapes.add_textbox(Inches(8.8), Inches(1.75), Inches(3.5), Inches(4.6))
    tf_time = tb_time.text_frame
    tf_time.word_wrap = True

    p_th = tf_time.paragraphs[0]
    p_th.text = "SIX-STAGE DEVELOPMENT LIFECYCLE"
    p_th.font.name = FONT_MONO
    p_th.font.size = Pt(9)
    p_th.font.bold = True
    p_th.font.color.rgb = ACCENT_COBALT

    timeline_steps = [
        ("STAGE 01", "UX Foundation & Liquid Glass", "Designed token system, ambient glows, frosted cards."),
        ("STAGE 02", "Domain & Incident Modeling", "Defined 4 feedback categories, 42-store schema."),
        ("STAGE 03", "AI Copilot Engineering", "Tuned Gemini 2.0 Flash prompt, voice in/out pipeline."),
        ("STAGE 04", "3D Spatial Twin Integration", "Mapped store floor, orbital Spline viewer, IoT pins."),
        ("STAGE 05", "Vector PDF Audit Engine", "Built full-white A4 print document with expense breakdown."),
        ("STAGE 06", "Cross-Route Integration", "Unified /dashboard, /app-dashboard, and /admin routes."),
    ]

    for step_num, step_name, step_desc in timeline_steps:
        p_st = tf_time.add_paragraph()
        p_st.text = f"{step_num}  •  {step_name}"
        p_st.font.name = FONT_HEAD
        p_st.font.size = Pt(10.5)
        p_st.font.bold = True
        p_st.font.color.rgb = TEXT_WHITE
        p_st.space_before = Pt(9)

        p_sd = tf_time.add_paragraph()
        p_sd.text = step_desc
        p_sd.font.name = FONT_BODY
        p_sd.font.size = Pt(9)
        p_sd.font.color.rgb = TEXT_GRAY

    # Bottom Tech Stack Badges
    p_tech = create_panel(s4, Inches(0.8), Inches(6.65), Inches(11.733), Inches(0.55), SURFACE_DARK, BORDER_SUBTLE)
    tb_tech = s4.shapes.add_textbox(Inches(0.9), Inches(6.68), Inches(11.5), Inches(0.5))
    p_tt = tb_tech.text_frame.paragraphs[0]
    p_tt.text = "PROVEN TECH STACK:  React 19  |  TypeScript  |  Vite  |  Tailwind CSS  |  Google Gemini 2.0 Flash  |  Spline WebGL  |  Web Speech API  |  TanStack Router"
    p_tt.font.name = FONT_MONO
    p_tt.font.size = Pt(9)
    p_tt.font.color.rgb = ACCENT_ICE

    # ==========================================
    # SLIDE 5 — CHALLENGES & MITIGATION
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "Challenges & Mitigation", "Three critical operational barriers solved through intelligent automation.")

    challs = [
        (
            "01",
            "NOISE & VOLUME",
            "PROBLEM:",
            "Over 2,800+ customer and staff comments flood head office weekly in multiple languages, slang, and formats. Critical food safety and compliance failures are buried under minor product complaints.",
            "MITIGATION:",
            "Gemini 2.0 Flash NLP parses unstructured text instantly, triaging feedback into 4 operational sectors with automated Critical/High severity tags and 100% evidence preservation.",
            ALERT_RED,
            ACCENT_COBALT
        ),
        (
            "02",
            "ATTRIBUTION & OWNERSHIP",
            "PROBLEM:",
            "Customers complain about symptoms ('warm milk', 'slow checkout') rather than root causes. Without physical equipment mapping, teams play blame games between Store Ops, Facilities, and IT.",
            "MITIGATION:",
            "Direct 1-to-1 correlation matrix connects grievances to physical store assets (Freezer C4, Printer #B2, Switch 04), visually located in the 3D twin with designated management owners.",
            ALERT_RED,
            ACCENT_COBALT
        ),
        (
            "03",
            "FINANCIAL BLIND SPOTS",
            "PROBLEM:",
            "Technician invoices, equipment downtime, and parts costs live in disconnected ERP spreadsheets. Leadership cannot see how much fixing customer issues actually costs until weeks later.",
            "MITIGATION:",
            "Live itemized tracking of technician hours ($180-$980) and parts costs ($200-$870) aggregated into Daily ($3.9k), Weekly ($18.4k), and Monthly ($64.2k) boardroom-ready PDF audits.",
            ALERT_RED,
            ACCENT_COBALT
        ),
    ]

    col_w5 = Inches(3.64)
    for m, (c_num, c_title, p_lbl, p_text, m_lbl, m_text, p_col, m_col) in enumerate(challs):
        c5_left = Inches(0.8 + m * 4.04)
        create_panel(s5, c5_left, Inches(1.6), col_w5, Inches(5.4), SURFACE_DARK, BORDER_SUBTLE)

        tb5 = s5.shapes.add_textbox(c5_left + Inches(0.2), Inches(1.75), col_w5 - Inches(0.4), Inches(5.1))
        tf5 = tb5.text_frame
        tf5.word_wrap = True

        p_cn = tf5.paragraphs[0]
        p_cn.text = f"CHALLENGE {c_num}"
        p_cn.font.name = FONT_MONO
        p_cn.font.size = Pt(9)
        p_cn.font.bold = True
        p_cn.font.color.rgb = p_col

        p_ct = tf5.add_paragraph()
        p_ct.text = c_title
        p_ct.font.name = FONT_HEAD
        p_ct.font.size = Pt(17)
        p_ct.font.bold = True
        p_ct.font.color.rgb = TEXT_WHITE
        p_ct.space_before = Pt(4)

        # Problem Box
        p_plbl = tf5.add_paragraph()
        p_plbl.text = p_lbl
        p_plbl.font.name = FONT_MONO
        p_plbl.font.size = Pt(8.5)
        p_plbl.font.bold = True
        p_plbl.font.color.rgb = ALERT_RED
        p_plbl.space_before = Pt(12)

        p_pbody = tf5.add_paragraph()
        p_pbody.text = p_text
        p_pbody.font.name = FONT_BODY
        p_pbody.font.size = Pt(10)
        p_pbody.font.color.rgb = TEXT_GRAY
        p_pbody.space_before = Pt(3)

        # Mitigation Box
        p_mlbl = tf5.add_paragraph()
        p_mlbl.text = m_lbl
        p_mlbl.font.name = FONT_MONO
        p_mlbl.font.size = Pt(8.5)
        p_mlbl.font.bold = True
        p_mlbl.font.color.rgb = ACCENT_ICE
        p_mlbl.space_before = Pt(14)

        p_mbody = tf5.add_paragraph()
        p_mbody.text = m_text
        p_mbody.font.name = FONT_BODY
        p_mbody.font.size = Pt(10)
        p_mbody.font.color.rgb = TEXT_WHITE
        p_mbody.space_before = Pt(3)

    # ==========================================
    # SLIDE 6 — UNIQUE SELLING PROPOSITION (USP)
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "Unique Selling Proposition", "Voice of Store connects what customers report to where the problem exists, who owns it, and what happens next.")

    # 3 Strategic Pillars
    pillars = [
        (
            "PILLAR 01",
            "CONVERSATIONAL INTELLIGENCE",
            "Gemini 2.0 Flash Copilot",
            "Voice-first operational chief-of-staff providing crisp 2-3 sentence briefings. Natural speech recognition and voice synthesis with instant live telemetry refresh.",
            ACCENT_COBALT
        ),
        (
            "PILLAR 02",
            "SPATIAL STORE INTELLIGENCE",
            "3D Physical Digital Twin",
            "Translates raw complaint logs into physical 3D store reality. Flashing equipment beacons reveal failure locations in Bakery, Cold Storage, POS, and HVAC zones.",
            ACCENT_ICE
        ),
        (
            "PILLAR 03",
            "CLOSED-LOOP OPERATIONS",
            "Autonomous Protocol & Audit",
            "From signal detection to POS barcode lockdown, containment runbooks, itemized maintenance expenses, and 1-click boardroom-certified A4 PDF audit reports.",
            ACCENT_VIOLET
        ),
    ]

    col_w6 = Inches(3.64)
    for n, (p_num, p_head, p_sub, p_desc, p_accent) in enumerate(pillars):
        c6_left = Inches(0.8 + n * 4.04)
        create_panel(s6, c6_left, Inches(1.6), col_w6, Inches(4.3), SURFACE_DARK, BORDER_SUBTLE)

        tb6 = s6.shapes.add_textbox(c6_left + Inches(0.2), Inches(1.8), col_w6 - Inches(0.4), Inches(4.0))
        tf6 = tb6.text_frame
        tf6.word_wrap = True

        p_pn = tf6.paragraphs[0]
        p_pn.text = p_num
        p_pn.font.name = FONT_MONO
        p_pn.font.size = Pt(9)
        p_pn.font.bold = True
        p_pn.font.color.rgb = p_accent

        p_ph = tf6.add_paragraph()
        p_ph.text = p_head
        p_ph.font.name = FONT_HEAD
        p_ph.font.size = Pt(17)
        p_ph.font.bold = True
        p_ph.font.color.rgb = TEXT_WHITE
        p_ph.space_before = Pt(4)

        p_ps = tf6.add_paragraph()
        p_ps.text = p_sub
        p_ps.font.name = FONT_HEAD
        p_ps.font.size = Pt(11)
        p_ps.font.italic = True
        p_ps.font.color.rgb = ACCENT_ICE
        p_ps.space_before = Pt(4)

        p_pd = tf6.add_paragraph()
        p_pd.text = p_desc
        p_pd.font.name = FONT_BODY
        p_pd.font.size = Pt(10.5)
        p_pd.font.color.rgb = TEXT_GRAY
        p_pd.space_before = Pt(12)

    # Bottom Signature Workflow
    p_sig = create_panel(s6, Inches(0.8), Inches(6.1), Inches(11.733), Inches(0.9), PANEL_ELEVATED, BORDER_COBALT)
    tb_sig = s6.shapes.add_textbox(Inches(0.95), Inches(6.18), Inches(11.4), Inches(0.8))
    tf_sig = tb_sig.text_frame
    tf_sig.word_wrap = True

    p_slbl = tf_sig.paragraphs[0]
    p_slbl.text = "SIGNATURE VALUE WORKFLOW"
    p_slbl.font.name = FONT_MONO
    p_slbl.font.size = Pt(8.5)
    p_slbl.font.bold = True
    p_slbl.font.color.rgb = ACCENT_COBALT

    p_sflow = tf_sig.add_paragraph()
    p_sflow.text = "HEAR (Voice AI)  ──►  LOCATE (3D Twin)  ──►  PRIORITIZE (Severity Engine)  ──►  ACT (Runbooks)  ──►  MEASURE (Financial Audit)"
    p_sflow.font.name = FONT_HEAD
    p_sflow.font.size = Pt(11.5)
    p_sflow.font.bold = True
    p_sflow.font.color.rgb = TEXT_WHITE
    p_sflow.space_before = Pt(3)

    # ==========================================
    # SLIDE 7 — DEMO & POC VIDEO
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "Demo & POC Video", "From a customer signal to an operational response.")

    # Left: Large Demo Video Frame (~65%)
    p_vid = create_panel(s7, Inches(0.8), Inches(1.6), Inches(7.6), Inches(4.4), SURFACE_DARK, BORDER_COBALT)
    
    # Check if video exists in public
    vid_file = r"C:\Users\sekha\Downloads\liquid-glass-effect-main\liquid-glass-effect-main\public\gemini_generated_video_6d31b3fd.mp4"
    
    tb_vid = s7.shapes.add_textbox(Inches(1.0), Inches(2.8), Inches(7.2), Inches(2.0))
    tf_vid = tb_vid.text_frame
    tf_vid.word_wrap = True

    p_vh = tf_vid.paragraphs[0]
    p_vh.alignment = PP_ALIGN.CENTER
    p_vh.text = "▶  [VOICE OF STORE DEMO VIDEO]"
    p_vh.font.name = FONT_HEAD
    p_vh.font.size = Pt(20)
    p_vh.font.bold = True
    p_vh.font.color.rgb = TEXT_WHITE

    p_vs = tf_vid.add_paragraph()
    p_vs.alignment = PP_ALIGN.CENTER
    p_vs.text = "Watch the end-to-end incident triage: Customer allergen signal ➔ Voice Copilot query ➔ 3D twin pin ➔ POS lock"
    p_vs.font.name = FONT_BODY
    p_vs.font.size = Pt(11)
    p_vs.font.color.rgb = ACCENT_ICE
    p_vs.space_before = Pt(8)

    p_vf = tf_vid.add_paragraph()
    p_vf.alignment = PP_ALIGN.CENTER
    p_vf.text = f"Video Asset: {os.path.basename(vid_file)} (2.1 MB Ultra-HD Presentation MP4)"
    p_vf.font.name = FONT_MONO
    p_vf.font.size = Pt(9.5)
    p_vf.font.color.rgb = TEXT_GRAY
    p_vf.space_before = Pt(6)

    # Right: 3 Stacked Authentic Screenshots Previews
    right_cards = [
        ("AI COPILOT (/dashboard)", "Spline 3D Core with conversational voice input & live response", ACCENT_COBALT),
        ("3D STORE TWIN (/environment)", "Spatial store layout with equipment IoT incident markers", ACCENT_ICE),
        ("FEEDBACK ENGINE (/app-dashboard)", "Sector intelligence matrix & full-white PDF audit export", ACCENT_VIOLET),
    ]

    for q, (r_title, r_desc, r_tone) in enumerate(right_cards):
        r_top = Inches(1.6 + q * 1.48)
        p_rc = create_panel(s7, Inches(8.6), r_top, Inches(3.933), Inches(1.36), PANEL_ELEVATED, BORDER_SUBTLE)
        
        tb_rc = s7.shapes.add_textbox(Inches(8.8), r_top + Inches(0.1), Inches(3.5), Inches(1.2))
        tf_rc = tb_rc.text_frame
        tf_rc.word_wrap = True

        p_rt = tf_rc.paragraphs[0]
        p_rt.text = r_title
        p_rt.font.name = FONT_MONO
        p_rt.font.size = Pt(8.5)
        p_rt.font.bold = True
        p_rt.font.color.rgb = r_tone

        p_rd = tf_rc.add_paragraph()
        p_rd.text = r_desc
        p_rd.font.name = FONT_BODY
        p_rd.font.size = Pt(9.5)
        p_rd.font.color.rgb = TEXT_WHITE
        p_rd.space_before = Pt(4)

    # Bottom Live Demo Banner & Sequence
    p_demofoot = create_panel(s7, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.85), PANEL_ELEVATED, BORDER_SUBTLE)
    tb_df = s7.shapes.add_textbox(Inches(1.0), Inches(6.2), Inches(11.3), Inches(0.75))
    tf_df = tb_df.text_frame
    tf_df.word_wrap = True

    p_dseq = tf_df.paragraphs[0]
    p_dseq.text = "DEMO WALKTHROUGH SEQUENCE:  Ask Voice AI  ──►  Detect Incident  ──►  Locate in 3D  ──►  Route Sector  ──►  Resolve  ──►  Export PDF"
    p_dseq.font.name = FONT_MONO
    p_dseq.font.size = Pt(8.5)
    p_dseq.font.bold = True
    p_dseq.font.color.rgb = ACCENT_ICE

    p_durl = tf_df.add_paragraph()
    p_durl.text = "LIVE DEMO REPOSITORY / URL:  http://localhost:8080  |  [INSERT PRODUCTION URL OR GITHUB LINK]"
    p_durl.font.name = FONT_HEAD
    p_durl.font.size = Pt(11)
    p_durl.font.bold = True
    p_durl.font.color.rgb = TEXT_WHITE
    p_durl.space_before = Pt(3)

    # Save to user requested location
    out_ppt_path = r"C:\Users\sekha\Downloads\liquid-glass-effect-main\liquid-glass-effect-main\public\Voice_of_Store_AI_Frontier_Pitch_Deck.pptx"
    prs.save(out_ppt_path)
    print(f"Presentation saved successfully to: {out_ppt_path}")

if __name__ == "__main__":
    build_pitch_deck()
