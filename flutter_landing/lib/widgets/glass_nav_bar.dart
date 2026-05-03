import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';

class GlassNavBar extends StatelessWidget {
  const GlassNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    // FIX: hide nav text links on narrow screens to prevent overflow.
    // Breakpoint matches the SliverAppBar side-padding breakpoint (900px).
    final isWide = MediaQuery.sizeOf(context).width >= 700;

    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            border: Border.all(color: AppTheme.border.withValues(alpha: 0.75), width: 1),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Row(
            children: [
              Text(
                'ShopSphere',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                ),
              ),
              const Spacer(),
              if (isWide) ...[
                _NavItem(label: 'Collection'),
                const SizedBox(width: 14),
                _NavItem(label: 'Featured'),
                const SizedBox(width: 14),
                _NavItem(label: 'Craft'),
                const SizedBox(width: 18),
              ],
              _PillButton(
                label: 'Sign in',
                onPressed: () {},
              ),
              const SizedBox(width: 10),
              _PillButton(
                label: 'Shop',
                primary: true,
                onPressed: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatefulWidget {
  const _NavItem({required this.label});
  final String label;

  @override
  State<_NavItem> createState() => _NavItemState();
}

class _NavItemState extends State<_NavItem> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: AnimatedDefaultTextStyle(
        duration: const Duration(milliseconds: 160),
        style: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: _hover ? AppTheme.text : AppTheme.muted,
          letterSpacing: 0.2,
        ),
        child: Text(widget.label),
      ),
    );
  }
}

class _PillButton extends StatefulWidget {
  const _PillButton({
    required this.label,
    required this.onPressed,
    this.primary = false,
  });

  final String label;
  final VoidCallback onPressed;
  final bool primary;

  @override
  State<_PillButton> createState() => _PillButtonState();
}

class _PillButtonState extends State<_PillButton> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    final bg = widget.primary
        ? AppTheme.accentBlue.withValues(alpha: _hover ? 0.9 : 0.75)
        : Colors.white.withValues(alpha: _hover ? 0.08 : 0.06);
    final fg = widget.primary ? AppTheme.text : AppTheme.text.withValues(alpha: 0.9);

    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: widget.primary
                  ? AppTheme.accentBlue.withValues(alpha: 0.55)
                  : AppTheme.border.withValues(alpha: 0.7),
              width: 1,
            ),
          ),
          child: Text(
            widget.label,
            style: GoogleFonts.inter(
              fontSize: 12.5,
              fontWeight: FontWeight.w600,
              color: fg,
              letterSpacing: 0.2,
            ),
          ),
        ),
      ),
    );
  }
}
