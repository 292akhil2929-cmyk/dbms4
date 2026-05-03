import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';
import '../widgets/in_view_fade.dart';

class FooterSection extends StatelessWidget {
  const FooterSection({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, c) {
        final pad = EdgeInsets.symmetric(
          horizontal: c.maxWidth >= 900 ? 56 : 22,
          vertical: 56,
        );
        // FIX: Align centres the ConstrainedBox on screens wider than 1220px
        // so the footer card doesn't sit left-aligned after the padding ends.
        return SliverToBoxAdapter(
          child: Padding(
            padding: pad,
            child: Align(
              alignment: Alignment.topCenter,
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1220),
                child: Container(
                  padding: const EdgeInsets.all(26),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: AppTheme.border.withValues(alpha: 0.85), width: 1),
                    color: AppTheme.surface.withValues(alpha: 0.55),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      InViewFade(
                        child: Text(
                          'ShopSphere',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      InViewFade(
                        delay: const Duration(milliseconds: 70),
                        child: Text(
                          'Luxury essentials for modern minimalists.',
                          style: GoogleFonts.inter(color: AppTheme.muted, height: 1.6),
                        ),
                      ),
                      const SizedBox(height: 18),
                      const Divider(height: 1),
                      const SizedBox(height: 18),
                      Wrap(
                        spacing: 14,
                        runSpacing: 10,
                        children: const [
                          _Link('Privacy'),
                          _Link('Terms'),
                          _Link('Support'),
                          _Link('Returns'),
                          _Link('Contact'),
                        ],
                      ),
                      const SizedBox(height: 18),
                      Text(
                        '© 2026 ShopSphere. Crafted with restraint.',
                        style: GoogleFonts.inter(fontSize: 12.5, color: AppTheme.muted),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _Link extends StatefulWidget {
  const _Link(this.label);
  final String label;

  @override
  State<_Link> createState() => _LinkState();
}

class _LinkState extends State<_Link> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: AnimatedDefaultTextStyle(
        duration: const Duration(milliseconds: 140),
        style: GoogleFonts.inter(
          fontSize: 12.5,
          fontWeight: FontWeight.w600,
          color: _hover ? AppTheme.text : AppTheme.muted,
        ),
        child: Text(widget.label),
      ),
    );
  }
}
