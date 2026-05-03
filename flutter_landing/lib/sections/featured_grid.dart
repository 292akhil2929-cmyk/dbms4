import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';
import '../widgets/in_view_fade.dart';

class FeaturedGrid extends StatelessWidget {
  const FeaturedGrid({super.key});

  static const _products = <_Product>[
    _Product('Obsidian Chrono', '\$1,499', 'Swiss movement. Ceramic bezel. Blue lume.'),
    _Product('Carbon Wallet', '\$189', 'Ultra-thin. RFID safe. Carbon weave.'),
    _Product('Noir Earbuds', '\$249', 'Active noise cancel. Spatial audio.'),
    _Product('Titanium Bottle', '\$79', 'Thermal lock. Minimal silhouette.'),
    _Product('Sable Backpack', '\$319', 'Structured form. Water-resistant.'),
    _Product('Aurum Strap', '\$129', 'Full-grain leather. Quick release.'),
  ];

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, c) {
        final w = c.maxWidth;
        final cross = w >= 1100
            ? 3
            : w >= 760
                ? 2
                : 1;

        // FIX: Wrap ConstrainedBox in Align so content centres on very wide
        // screens instead of sitting left-aligned after the padding ends.
        return SliverPadding(
          padding: EdgeInsets.symmetric(horizontal: w >= 900 ? 56 : 22, vertical: 44),
          sliver: SliverToBoxAdapter(
            child: Align(
              alignment: Alignment.topCenter,
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1220),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    InViewFade(
                      child: Text(
                        'Featured',
                        style: GoogleFonts.inter(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          letterSpacing: -0.4,
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    InViewFade(
                      delay: const Duration(milliseconds: 70),
                      child: Text(
                        'Quietly bold essentials. Minimal. Precise. Built to last.',
                        style: GoogleFonts.inter(color: AppTheme.muted, height: 1.6),
                      ),
                    ),
                    const SizedBox(height: 22),
                    _Grid(crossAxisCount: cross),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _Grid extends StatelessWidget {
  const _Grid({required this.crossAxisCount});
  final int crossAxisCount;

  @override
  Widget build(BuildContext context) {
    final items = FeaturedGrid._products;
    return LayoutBuilder(
      builder: (context, c) {
        final cardH = crossAxisCount == 1 ? 170.0 : 210.0;

        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: items.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            mainAxisSpacing: 14,
            crossAxisSpacing: 14,
            childAspectRatio: (c.maxWidth / crossAxisCount) / cardH,
          ),
          itemBuilder: (context, i) => InViewFade(
            delay: Duration(milliseconds: 40 * (i % crossAxisCount)),
            child: _ProductCard(p: items[i]),
          ),
        );
      },
    );
  }
}

class _ProductCard extends StatefulWidget {
  const _ProductCard({required this.p});
  final _Product p;

  @override
  State<_ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<_ProductCard> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    final shadow = BoxShadow(
      blurRadius: _hover ? 22 : 14,
      spreadRadius: -10,
      offset: Offset(0, _hover ? 14 : 10),
      color: Colors.black.withValues(alpha: _hover ? 0.55 : 0.42),
    );

    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppTheme.surface2.withValues(alpha: 0.72),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppTheme.border.withValues(alpha: 0.85), width: 1),
          boxShadow: [shadow],
        ),
        child: Row(
          children: [
            Container(
              width: 58,
              height: 58,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withValues(alpha: 0.07), width: 1),
                color: Colors.black.withValues(alpha: 0.22),
              ),
              child: Icon(Icons.auto_awesome, color: AppTheme.accentBlue.withValues(alpha: 0.85)),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    widget.p.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: -0.2),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.p.desc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.inter(fontSize: 12.5, color: AppTheme.muted, height: 1.45),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(widget.p.price, style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 13)),
                const SizedBox(height: 10),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 160),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    color: _hover
                        ? AppTheme.accentBlue.withValues(alpha: 0.78)
                        : Colors.white.withValues(alpha: 0.06),
                    border: Border.all(
                      color: _hover
                          ? AppTheme.accentBlue.withValues(alpha: 0.55)
                          : AppTheme.border.withValues(alpha: 0.8),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    'Add',
                    style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Product {
  const _Product(this.name, this.price, this.desc);
  final String name;
  final String price;
  final String desc;
}
