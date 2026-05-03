import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';

class HeroSection extends StatefulWidget {
  const HeroSection({super.key});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(seconds: 14))
        ..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, c) {
        final isWide = c.maxWidth >= 980;
        final heroH = math.max(640.0, MediaQuery.sizeOf(context).height);

        return SizedBox(
          height: heroH,
          child: Stack(
            fit: StackFit.expand,
            children: [
              AnimatedBuilder(
                animation: _c,
                builder: (context, _) =>
                    CustomPaint(painter: _SlowGradientPainter(t: _c.value)),
              ),
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black.withValues(alpha: 0.20),
                      Colors.black.withValues(alpha: 0.72),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: isWide ? 56 : 22,
                  vertical: isWide ? 72 : 56,
                ),
                child: Align(
                  alignment: Alignment.center,
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1220),
                    child: isWide
                        ? Row(
                            children: [
                              Expanded(child: _Copy()),
                              const SizedBox(width: 44),
                              Expanded(child: _HeroProductCard()),
                            ],
                          )
                        : Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              _Copy(),
                              SizedBox(height: 26),
                              _HeroProductCard(),
                            ],
                          ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Copy extends StatelessWidget {
  const _Copy();

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 520),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.06),
                border: Border.all(
                  color: AppTheme.border.withValues(alpha: 0.75),
                  width: 1,
                ),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                'NEW SEASON — 2026',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.9,
                  color: AppTheme.muted,
                ),
              ),
            ),
            const SizedBox(height: 18),
            Text(
              'Minimal luxury.\nBuilt to feel\ninevitable.',
              style: GoogleFonts.inter(
                fontSize: 54,
                height: 1.05,
                fontWeight: FontWeight.w700,
                letterSpacing: -2.2,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Apple-meets-Rolex craftsmanship. Deep charcoal surfaces, crisp typography, and a quiet electric-blue edge.',
              style: GoogleFonts.inter(
                fontSize: 15.5,
                height: 1.65,
                color: AppTheme.muted,
                fontWeight: FontWeight.w400,
              ),
            ),
            const SizedBox(height: 22),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: const [
                _CtaPill(label: 'Explore collection', primary: true),
                _CtaPill(label: 'View craftsmanship'),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                _TinyMetric(title: 'Shipping', value: '24h dispatch'),
                const SizedBox(width: 16),
                _TinyMetric(title: 'Warranty', value: '2 years'),
                const SizedBox(width: 16),
                _TinyMetric(title: 'Support', value: 'Concierge'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _HeroProductCard extends StatelessWidget {
  const _HeroProductCard();

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1.05,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.surface.withValues(alpha: 0.70),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: AppTheme.border.withValues(alpha: 0.8),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              blurRadius: 28,
              spreadRadius: -12,
              offset: const Offset(0, 18),
              color: Colors.black.withValues(alpha: 0.55),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(22),
          child: Stack(
            children: [
              Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.white.withValues(alpha: 0.08),
                        Colors.white.withValues(alpha: 0.02),
                      ],
                    ),
                  ),
                ),
              ),
              Positioned.fill(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.06),
                        width: 1,
                      ),
                      color: Colors.black.withValues(alpha: 0.20),
                    ),
                    child: Center(
                      child: Icon(
                        Icons.watch_rounded,
                        size: 96,
                        color: AppTheme.text.withValues(alpha: 0.92),
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                left: 20,
                right: 20,
                bottom: 18,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.35),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: AppTheme.border.withValues(alpha: 0.8),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Aurum Chrono',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                letterSpacing: -0.2,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Obsidian / Electric Blue',
                              style: GoogleFonts.inter(
                                fontSize: 12.5,
                                color: AppTheme.muted,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 9,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(999),
                          color: AppTheme.accentBlue.withValues(alpha: 0.78),
                          border: Border.all(
                            color: AppTheme.accentBlue.withValues(alpha: 0.55),
                            width: 1,
                          ),
                        ),
                        child: Text(
                          '\$1,499',
                          style: GoogleFonts.inter(
                            fontWeight: FontWeight.w700,
                            fontSize: 12.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CtaPill extends StatefulWidget {
  const _CtaPill({required this.label, this.primary = false});
  final String label;
  final bool primary;

  @override
  State<_CtaPill> createState() => _CtaPillState();
}

class _CtaPillState extends State<_CtaPill> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    final bg = widget.primary
        ? AppTheme.accentBlue.withValues(alpha: _hover ? 0.92 : 0.78)
        : Colors.white.withValues(alpha: _hover ? 0.08 : 0.06);
    final br = widget.primary
        ? AppTheme.accentBlue.withValues(alpha: 0.55)
        : AppTheme.border.withValues(alpha: 0.75);

    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: br, width: 1),
        ),
        child: Text(
          widget.label,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.2,
          ),
        ),
      ),
    );
  }
}

class _TinyMetric extends StatelessWidget {
  const _TinyMetric({required this.title, required this.value});
  final String title;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title.toUpperCase(),
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.8,
            color: AppTheme.muted,
          ),
        ),
        const SizedBox(height: 3),
        Text(
          value,
          style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600),
        ),
      ],
    );
  }
}

class _SlowGradientPainter extends CustomPainter {
  _SlowGradientPainter({required this.t});
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final cx = size.width * (0.5 + 0.12 * math.sin(t * math.pi * 2));
    final cy = size.height * (0.40 + 0.10 * math.cos(t * math.pi * 2));

    final r1 = math.max(size.width, size.height) * 0.92;
    final r2 = math.max(size.width, size.height) * 0.70;

    final paint = Paint()
      ..shader = RadialGradient(
        center:
            Alignment((cx / size.width) * 2 - 1, (cy / size.height) * 2 - 1),
        radius: 1.1,
        colors: [
          AppTheme.accentBlue.withValues(alpha: 0.22),
          const Color(0xFF7C3AED).withValues(alpha: 0.12),
          Colors.transparent,
        ],
        stops: const [0.0, 0.38, 1.0],
      ).createShader(rect);

    canvas.drawRect(rect, Paint()..color = AppTheme.bg);
    canvas.drawCircle(Offset(cx, cy), r1, paint);
    canvas.drawCircle(
      Offset(size.width * 0.78, size.height * 0.22),
      r2,
      Paint()
        ..shader = RadialGradient(
          center: const Alignment(0.75, -0.6),
          radius: 1.1,
          colors: [
            Colors.white.withValues(alpha: 0.06),
            Colors.transparent,
          ],
          stops: const [0.0, 1.0],
        ).createShader(rect),
    );
  }

  @override
  bool shouldRepaint(covariant _SlowGradientPainter oldDelegate) =>
      oldDelegate.t != t;
}
